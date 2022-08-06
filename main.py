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
    # Sign Code
    # 0: stop
    # 1: right
    # 2: left
    # 3: back
    basic.show_icon(IconNames.ASLEEP)

# ========================================
# RADIO
# ========================================

def on_received_value(name, value):
    pass

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

