current_is_run = 0
current_direction = 3
current_speed = 100
go_out_spot_steps = "1,l,"
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
    if "s:" in receivedString:
        start_delivery(receivedString.split(":")[1])
    if "a:" in receivedString:
        update_delivery(receivedString.split(":")[1], receivedString.split(":")[2])
    pass

radio.on_received_string(on_received_string)
radio.on_received_value(on_received_value)

# ========================================
# DELIVERY
# ========================================

def start_delivery(path: string):
    global current_steps
    global finished_steps
    path = go_out_spot_steps + path
    #basic.show_string(path)
    current_steps = path.split(",")
    finished_steps = []
    basic.show_icon(IconNames.YES)
    pass

def update_delivery(old_step: string, new_path: string):
    global current_steps
    if old_step not in current_steps:
        return
    new_steps = new_path.split(",")
    current_steps.remove_element(old_step)
    current_steps = new_steps + current_steps
    basic.show_icon(IconNames.YES)
    pass

def continue_delivery():
    global current_steps
    global finished_steps
    global current_speed
    index = 0
    if current_steps.length == 0:
        return
    current_steps.remove_element("")
    finished_steps.remove_element("")
    for step in current_steps:
        basic.pause(1500)
        if int(step) > 0:
            go_forward(current_speed, int(step))
            finished_steps.push(step)
            index += 1
        elif step == "r":
            turn_right(current_speed, 90)
            finished_steps.push(step)
            index += 1
        elif step == "l":
            turn_left(current_speed, 90)
            finished_steps.push(step)
            index += 1
        else:
            radio.send_string("r:" + step)
            pause(1000)
            break
        engine_stop()
    if index > current_steps.length:
        current_steps = []
    if index > 0:
        current_steps = current_steps[index:current_steps.length]
    go_back_home()
    pass

def go_back_home():
    global current_steps
    global finished_steps
    global current_speed
    if current_steps.length > 0 or finished_steps.length == 0:
        return
    basic.show_string("...")
    basic.pause(5000)
    basic.show_icon(IconNames.YES)
    prepare_path_go_home()
    turn_right(current_speed, 175)
    for step in finished_steps:
        basic.pause(1500)
        if int(step) > 0:
            go_forward(current_speed, int(step))
        if int(step) < 0:
            go_backward(current_speed, int(step) * -1)
        elif step == "r":
            turn_left(current_speed, 90)
        elif step == "l":
            turn_right(current_speed, 90)
        engine_stop()
    finished_steps = []
    radio.send_string("f:")
    pass

def prepare_path_go_home():
    global finished_steps
    finished_steps = finished_steps[::-1]
    finished_steps.pop(finished_steps.length - 1)
    finished_steps.pop(finished_steps.length - 1)
    finished_steps.push("r")
    finished_steps.push("-1")


# ========================================
# BUTTON
# ========================================

def on_button_pressed_a():
    start_delivery("2,l,2,r,2,u2")
    pass

def on_button_pressed_b():
    update_delivery("u2", "r,2,l")
    pass

def on_button_pressed_ab():
    global current_steps
    global finished_steps
    current_steps = [""]
    finished_steps = [""]
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
    motor.motor_run(motor.Motors.M1, motor.Dir.CCW, speed)
    motor.motor_run(motor.Motors.M2, motor.Dir.CCW, speed)
    if length > 0:
        basic.pause(length * 900)
    engine_stop()


def go_backward(speed: number, length: number = 0):
    engine_stop()
    motor.motor_run(motor.Motors.M1, motor.Dir.CW, speed)
    motor.motor_run(motor.Motors.M2, motor.Dir.CW, speed)
    if length > 0:
        basic.pause(length * 900)
    engine_stop()


def turn_right(speed: number, angle: number = None):
    engine_stop()
    motor.motor_run(motor.Motors.M1, motor.Dir.CCW, speed + 60)
    motor.motor_run(motor.Motors.M2, motor.Dir.CW, speed + 60)
    if angle is not None:
        pause(angle * 5.99)
    engine_stop()

def turn_left(speed: number, angle: number = None):
    engine_stop()
    motor.motor_run(motor.Motors.M2, motor.Dir.CCW, speed + 60)
    motor.motor_run(motor.Motors.M1, motor.Dir.CW, speed + 60)
    if angle is not None:
        pause(angle * 5.99)
    engine_stop()
        
def engine_stop():
    motor.motor_stop(motor.Motors.M1)
    motor.motor_stop(motor.Motors.M2)
    pass
