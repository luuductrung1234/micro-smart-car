current_is_run = 0
current_direction = 3
current_speed = 40
current_steps = [""]
finished_steps = [""]

# ========================================
# BASIC
# ========================================

def on_start():
    basic.show_icon(IconNames.HAPPY)
    radio.set_group(2208061444)

def on_forever():
    basic.show_string("C") # Car
    continue_delivery()

on_start()
basic.forever(on_forever)

# ========================================
# RADIO
# ========================================

def on_received_value(name, value):
    if name == "mode":
        engine_stop()
        basic.show_string("M")
    if name == "steps":
        basic.show_string("S")
    if name == "is_run":
        handle_run(value)
    if name == "dir":
        handle_direction(value)
    if name == "speed":
        handle_speed(value)

def on_received_string(receivedString):
    if "start:" in receivedString:
        basic.show_string("a")
        start_delivery(receivedString.split(":")[1])
    if "answer:" in receivedString:
        basic.show_string("b")
        update_delivery(receivedString.split(":")[1], receivedString.split(":")[2])
    pass

radio.on_received_string(on_received_string)
radio.on_received_value(on_received_value)

# ========================================
# DELIVERY
# ========================================

def start_delivery(path: string):
    global current_steps
    current_steps = path.split(",")
    pass

def update_delivery(old_step: string, new_path: string):
    global current_steps
    if old_step not in current_steps:
        return
    new_steps = new_path.split(",")
    current_steps.remove_element(old_step)
    current_steps = new_steps + current_steps
    pass

def continue_delivery():
    global current_steps
    global finished_steps
    global current_speed
    index = 0
    current_steps.remove_element("")
    finished_steps.remove_element("")
    for step in current_steps:
        basic.show_string(step)
        if int(step) > 0:
            go_forward(current_speed, int(step))
            finished_steps.push(step)
            index += 1
        elif step == "r":
            turn_right(current_speed, 45)
            finished_steps.push(step)
            index += 1
        elif step == "l":
            turn_left(current_speed, 45)
            finished_steps.push(step)
            index += 1
        else:
            radio.send_string("request:" + step)
            break
        engine_stop()
    if index > 0:
        current_steps = current_steps[index:current_steps.length]
    pass

# ========================================
# BUTTON
# ========================================

def on_button_pressed_a():
    start_delivery("1,r,l,2,u2")
    pass

def on_button_pressed_b():
    update_delivery("u2", "r,2,l")
    pass

def on_button_pressed_ab():
    global current_steps
    global finished_steps
    current_steps = ['']
    finished_steps = ['']
    pass

input.on_button_pressed(Button.AB, on_button_pressed_ab)
input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)


# ========================================
# HANDLER
# ========================================

def handle_steps(sign: number):
    pass

def handle_direction(direction: number):
    global current_is_run
    global current_direction
    global current_speed
    if current_direction != direction:
        current_direction = direction
    else:
        return
    if current_is_run == 0:
        return
    engine_run(current_direction, current_speed)

def handle_run(is_run: number):
    global current_is_run
    global current_direction
    global current_speed
    #basic.show_number(is_run)
    if is_run == 0:
        current_is_run = 0
        engine_stop()
    if is_run == 1:
        current_is_run = 1
        go_forward(current_speed)

def handle_speed(speed: number):
    global current_is_run
    global current_direction
    global current_speed
    #basic.show_number(speed)
    if current_speed == speed:
        return
    current_speed = speed
    engine_run(current_direction, current_speed)


# ========================================
# ENGINE
# ========================================

def engine_run(direction: number, speed: number):
    if direction == 1:
        turn_left(speed)
    if direction == 2:
        turn_right(speed)
    if direction == 3:
        go_forward(speed)
    if direction == 4:
        go_backward(speed)

def go_forward(speed: number, length: number = 0):
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
    if length > 0:
        basic.pause(length * 1500)


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

def turn_right(speed: number, angle: number = None):
    engine_stop()
    motor.motor_run(motor.Motors.M1, motor.Dir.CW, speed + 40)
    motor.motor_run(motor.Motors.M2, motor.Dir.CCW, speed + 40)
    basic.show_leds("""
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
    """)
    if angle is not None:
        basic.pause(angle * 17)

def turn_left(speed: number, angle: number = None):
    engine_stop()
    motor.motor_run(motor.Motors.M3, motor.Dir.CW, speed + 40)
    motor.motor_run(motor.Motors.M4, motor.Dir.CCW, speed + 40)
    basic.show_leds("""
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
    """)
    if angle is not None:
        basic.pause(angle * 17)

def engine_stop():
    motor.motor_run(motor.Motors.M1, motor.Dir.CCW, 0)
    motor.motor_run(motor.Motors.M2, motor.Dir.CW, 0)
    motor.motor_run(motor.Motors.M3, motor.Dir.CCW, 0)
    motor.motor_run(motor.Motors.M4, motor.Dir.CW, 0)
    pass