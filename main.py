current_is_run = 0
current_direction = 3
current_speed = 150
go_out_spot_steps = ["1", "l"]
go_in_spot_steps = ["l", "-1"]
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


def on_received_string(receivedString):
    if "s:" in receivedString:
        basic.show_string("a")
        start_delivery(receivedString.split(":")[1])
    if "a:" in receivedString:
        basic.show_string("b")
        update_delivery(receivedString.split(":")[1], receivedString.split(":")[2])
    pass

radio.on_received_string(on_received_string)


# ========================================
# DELIVERY
# ========================================

def start_delivery(path: string):
    global current_steps
    current_steps = path.split(",")
    go_out_spot()
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
    if current_steps.length == 0:
        return
    for step in current_steps:
        basic.show_string(step)
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
            break
        engine_stop()
    if index > 0:
        current_steps = current_steps[index:current_steps.length]
    #go_back_home()
    pass

def go_back_home():
    global current_steps
    global finished_steps
    global current_speed
    if current_steps.length > 0 or finished_steps.length == 0:
        return
    basic.show_string("...")
    basic.show_icon(IconNames.YES)
    turn_right(current_speed, 90)
    turn_right(current_speed, 90)
    finished_steps.reverse()
    for step in finished_steps:
        basic.show_string(step)
        if int(step) > 0:
            go_forward(current_speed, int(step))
        elif step == "r":
            turn_left(current_speed, 90)
        elif step == "l":
            turn_right(current_speed, 90)
        engine_stop()
    go_in_spot()
    finished_steps = [""]
    pass

def go_out_spot():
    global go_out_spot_steps
    for step in go_out_spot_steps:
        basic.show_string(step)
        if int(step) > 0:
            go_forward(current_speed, int(step))
        if int(step) < 0:
            go_backward(current_speed, int(step) * -1)
        elif step == "r":
            turn_right(current_speed, 90)
        elif step == "l":
            turn_left(current_speed, 90)
        engine_stop()
    pass

def go_in_spot():
    global go_in_spot_steps
    for step in go_in_spot_steps:
        basic.show_string(step)
        if int(step) > 0:
            go_forward(current_speed, int(step))
        if int(step) < 0:
            go_backward(current_speed, int(step) * -1)
        elif step == "r":
            turn_right(current_speed, 90)
        elif step == "l":
            turn_left(current_speed, 90)
        engine_stop()
    pass


# ========================================
# BUTTON
# ========================================

def on_button_pressed_a():
    start_delivery("r,l")
    pass

input.on_button_pressed(Button.A, on_button_pressed_a)


# ========================================
# ENGINE
# ========================================

def go_forward(speed: number, length: number = 0):
    engine_stop()
    rekabit.run_motor(MotorChannel.M1, MotorDirection.FORWARD, speed)
    rekabit.run_motor(MotorChannel.M2, MotorDirection.FORWARD, speed)
    basic.show_leds("""
        . . # . .
        . # # # .
        # . # . #
        . . # . .
        . . # . .
    """)
    if length > 0:
        basic.pause(length * 1500)


def go_backward(speed: number, length: number = 0):
    engine_stop()
    rekabit.run_motor(MotorChannel.M1, MotorDirection.BACKWARD, speed)
    rekabit.run_motor(MotorChannel.M2, MotorDirection.BACKWARD, speed)
    basic.show_leds("""
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
    """)
    if length > 0:
        basic.pause(length * 1500)


def turn_right(speed: number, angle: number):
    engine_stop()
    rekabit.run_motor(MotorChannel.M2, MotorDirection.FORWARD, speed)
    basic.show_leds("""
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
    """)
    pause(angle * 10)
    

def turn_left(speed: number, angle: number):
    engine_stop()
    rekabit.run_motor(MotorChannel.M1, MotorDirection.FORWARD, speed)
    basic.show_leds("""
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
    """)
    pause(angle * 10)
        
def engine_stop():
    rekabit.brake_motor(MotorChannel.M1)
    rekabit.brake_motor(MotorChannel.M2)
    pass
