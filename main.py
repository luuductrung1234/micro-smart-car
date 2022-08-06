LIMITED_DISTANCE = -40

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
    motor.servo(motor.Servos.S8, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S8, 0)

# ========================================
# RADIO
# ========================================

def on_received_value(name, value):
    global signal
    signal = radio.received_packet(RadioPacketProperty.SIGNAL_STRENGTH)
    sender = radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)
    time = radio.received_packet(RadioPacketProperty.TIME)
    basic.show_string(name)
    basic.show_string(str(signal))
    if name == "instruction" and signal <= LIMITED_DISTANCE:
        handle_street_sign(value)

radio.on_received_value(on_received_value)

# ========================================
# BUTTON
# ========================================

def on_button_pressed_a():
    motor.servo(motor.Servos.S8, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S8, 0)
    motor.motor_run(motor.Motors.M1, motor.Dir.CW, 20)
    motor.motor_run(motor.Motors.M2, motor.Dir.CW, 20)
    motor.motor_run(motor.Motors.M3, motor.Dir.CW, 20)
    motor.motor_run(motor.Motors.M4, motor.Dir.CW, 20)
    pass

def on_button_pressed_b():
    pass

input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)

