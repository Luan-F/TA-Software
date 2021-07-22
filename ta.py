import serial
import time
import pyautogui
import json

class Btn:
	def __init__(self) -> None:
		
		self.valor_botao = 48
		self.entrada_antiga = 0
		self.tempo = 0
		self.lastCommand = ''
		self.lastSelected = ''

		self.dados = {}
		self.maior = 3000

		with open('config.json', 'r') as config:
			self.dados = json.load(config)
			for i in self.dados:
				if self.dados[i][1] > self.maior:
					self.maior = self.dados[i][1]

					keys = open('keys.json', 'r')

		keys = open('keys.json', 'r')
		keysValues = json.load(keys)
		keys.close()

		for key in keysValues['keysConfig']:
			keysValues['keysConfig'][key] = False
		keysValues['lastSelected'] = ""

		keys = open('keys.json', 'w')
		json.dump(keysValues, keys)
		keys.close()

	# Atualiza o nome da última tecla pressionada (no keys.json)
	def __atualizaKeyLast(self) -> None:
		keysValues = {}

		keys = open('keys.json', 'r')
		keysValues = json.load(keys)
		keys.close()

		keysValues['lastSelected'] = self.lastCommand

		keys = open('keys.json', 'w')
		json.dump(keysValues, keys)
		keys.close()

	# Atualiza a chave no keys.json
	def __atualizaKeyConfig(self, key, valor = True) -> None:
		if key == '':
			return

		keysValues = {}

		keys = open('keys.json', 'r')
		keysValues = json.load(keys)
		keys.close()

		keysValues['keysConfig'][key] = valor

		keys = open('keys.json', 'w')
		json.dump(keysValues, keys)
		keys.close()
		
	# Atualiza a tecla no json
	def __updateCurrentKey(self, dt) -> str:
		if dt > self.maior:
			if self.lastCommand != self.lastSelected:
				self.__atualizaKeyConfig(self.lastCommand)
			return self.lastCommand

		for key in self.dados:
			t1, t2 = self.dados[key]
			if dt > t1 and dt <= t2:
				if self.lastSelected != '':
					self.__atualizaKeyConfig(self.lastSelected, False)
				self.__atualizaKeyConfig(key)
				self.lastSelected = key
				break

		return self.lastSelected

	# Contador do tempo
	def tempoPressionado(self, botao, botao_anterior) -> bool:
		dt = ms() - self.tempo

		if botao == self.valor_botao and botao_anterior != self.valor_botao:
			self.__atualizaKeyConfig('lastCommand', False)
			self.tempo = ms()
		elif botao != self.valor_botao and botao_anterior == self.valor_botao and dt <= self.maior:
			return True
		elif botao == self.valor_botao and dt > self.maior and self.lastCommand != '':
			print(f'{self.lastCommand}')
			self.__atualizaKeyConfig(self.lastSelected, False)
			self.__atualizaKeyConfig('lastCommand')
			pyautogui.press(self.lastCommand)
		elif botao == self.valor_botao and botao == botao_anterior:
			self.__updateCurrentKey(dt)

		return False


	# Aperta uma teclada de acordo com o tempo
	def comando(self, tempo) -> None:

		tecla = self.__updateCurrentKey(tempo)

		print(f'---{tecla}')
		pyautogui.press(tecla)
		self.lastCommand = tecla
		self.__atualizaKeyLast()
		self.tempo = 0

# Tempo em milisegundos
def ms():
	return round(time.time()*1000)

# Setup
entrada_antiga = 0
ser = serial.Serial('/dev/ttyUSB0', 9600)
time.sleep(1.5)
print(ser.port)

ta = Btn()

while 1:	
	entrada = str(ser.readline().decode().strip('\r\n'))
	if entrada != '':
		entrada = int(entrada)

	res = ta.tempoPressionado(entrada, entrada_antiga)

	if ta.tempo > 0 and res:
		dt = ms() - ta.tempo
		ta.comando(dt)

	time.sleep(0.001)
	entrada_antiga = entrada
