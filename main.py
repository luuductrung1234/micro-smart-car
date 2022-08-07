LIMITED_DISTANCE = -40

signal = 0
currenct_direction = 0
current_speed = 20

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
# RADIO
# ========================================

def on_received_value(name, value):
    if name == "mode":
        engine_stop()
        basic.show_string("M")
    if name == "steps":
        global signal
        signal = radio.received_packet(RadioPacketProperty.SIGNAL_STRENGTH)
        sender = radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)
        time = radio.received_packet(RadioPacketProperty.TIME)
        basic.show_string(str(signal))
        if signal <= LIMITED_DISTANCE:
            handle_steps(value)
        basic.show_string("S")
    if name == "is_run":
        handle_run(value)
        basic.show_string("R")
    if name == "direction":
        handle_direction(value)
        basic.show_string("D")
    if name == "speed":
        handle_speed(value)
        basic.show_string("S")

radio.on_received_value(on_received_value)

# ========================================
# BUTTON
# ========================================

def on_button_pressed_a():
    go_forward(50)
    pass

def on_button_pressed_b():
    pass

input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)


# ========================================
# MAIN
# ========================================

def handle_steps(sign: number):
    pass

def handle_direction(direction: number):
    global currenct_direction
    if currenct_direction == direction:
        return
    engine_run(direction)

def handle_run(is_run: number):
    global current_speed
    #basic.show_number(is_run)
    if is_run == 0:
        engine_stop()
    if is_run == 1:
        go_forward(current_speed)

def handle_speed(speed: number):
    global current_speed
    #basic.show_number(speed)
    if current_speed == speed:
        return
    current_speed = speed
    engine_run(currenct_direction)

def engine_run(direction: number):
    global current_speed
    global currenct_direction
    currenct_direction = direction
    if currenct_direction == 1:
        turn_left(current_speed)
    if currenct_direction == 2:
        turn_right(current_speed)
    if currenct_direction == 3:
        go_forward(current_speed)
    if currenct_direction == 4:
        go_backward(current_speed)

def go_forward(speed: number):
    engine_stop()
    motor.motor_run(motor.Motors.M1, motor.Dir.CW, speed)
    motor.motor_run(motor.Motors.M2, motor.Dir.CCW, speed)
    motor.motor_run(motor.Motors.M3, motor.Dir.CW, speed)
    motor.motor_run(motor.Motors.M4, motor.Dir.CCW, speed)
    basic.show_leds("""
        . . # . .
        . # # # .
        # . # . #
        . . # . .
        . . # . .
    """)

def go_backward(speed: number):
    engine_stop()
    motor.motor_run(motor.Motors.M1, motor.Dir.CCW, speed)
    motor.motor_run(motor.Motors.M2, motor.Dir.CW, speed)
    motor.motor_run(motor.Motors.M3, motor.Dir.CCW, speed)
    motor.motor_run(motor.Motors.M4, motor.Dir.CW, speed)
    basic.show_leds("""
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
    """)

def turn_right(speed: number):
    engine_stop()
    motor.motor_run(motor.Motors.M1, motor.Dir.CCW, speed)
    motor.motor_run(motor.Motors.M2, motor.Dir.CW, speed)
    motor.motor_run(motor.Motors.M3, motor.Dir.CW, speed)
    motor.motor_run(motor.Motors.M4, motor.Dir.CCW, speed)
    basic.show_leds("""
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
    """)

def turn_left(speed: number):
    engine_stop()
    motor.motor_run(motor.Motors.M1, motor.Dir.CW, speed)
    motor.motor_run(motor.Motors.M2, motor.Dir.CCW, speed)
    motor.motor_run(motor.Motors.M3, motor.Dir.CCW, speed)
    motor.motor_run(motor.Motors.M4, motor.Dir.CW, speed)
    basic.show_leds("""
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
    """)

def engine_stop():
    motor.motor_run(motor.Motors.M1, motor.Dir.CCW, 0)
    motor.motor_run(motor.Motors.M2, motor.Dir.CW, 0)
    motor.motor_run(motor.Motors.M3, motor.Dir.CCW, 0)
    motor.motor_run(motor.Motors.M4, motor.Dir.CW, 0)
    pass