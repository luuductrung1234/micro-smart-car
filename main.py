signal = 0

# ========================================
# BASIC
# ========================================

def on_start():
    basic.show_icon(IconNames.HAPPY)
    radio.set_group(2208061444)

def on_forever():
    basic.show_string("C") # Car
    
basic.forever(on_forever)

# ========================================
# MAIN
# ========================================

def handle_street_sign(sign: number):
    basic.show_icon(IconNames.ASLEEP)

# ========================================
# RADIO
# ========================================

def on_received_value(name, value):
    global signal
    signal = radio.received_packet(RadioPacketProperty.SIGNAL_STRENGTH)
    sender = radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)
    time = radio.received_packet(RadioPacketProperty.TIME)
    led.plot_bar_graph(Math.map(signal, -95, -42, 0, 9), 9)

radio.on_received_value(on_received_value)

# ========================================
# BUTTON
# ========================================

def on_button_pressed_a():
    motor.servo(motor.Servos.S1, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S1, 0)
    basic.show_icon(IconNames.SQUARE)

def on_button_pressed_b():
    motor.servo(motor.Servos.S8, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S1, 0)
    basic.show_icon(IconNames.SMALL_SQUARE)

input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)

