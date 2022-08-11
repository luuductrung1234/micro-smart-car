LIMITED_DISTANCE = -40

signal = 0
current_is_run = 0
current_direction = 3
current_speed = 30
current_location=""


# ========================================
# BASIC
# ========================================

def on_start():
    basic.show_icon(IconNames.HAPPY)
    radio.set_group(2208061444)

def on_forever():
    basic.show_string("1") # Car
    
    
basic.forever(on_forever)

# ========================================
# RADIO

# ========================================

def on_received_value(name, value):
    if name == "mode":
        engine_stop()
        basic.show_string("0")
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
    if name == "dir":
        handle_direction(value)
    if name == "speed":
        handle_speed(value)
    if name=="END":
        engine_stop()


radio.on_received_value(on_received_value)

#l,3,r,2,l,3,r,2
def on_received_string(decoded_path):
    global current_location
    basic.show_string("b")
    current_location = decoded_path
    handle_location(current_location)



radio.on_received_string(on_received_string)













# ========================================
# BUTTON
# ========================================

def on_button_pressed_a():
    global current_is_run
    global current_direction
    global current_speed

    current_is_run = 1
    current_speed = 40
    expected_direction = 0
    if current_direction == 4:
        expected_direction = 1
    else:
        expected_direction = current_direction + 1
    handle_direction(expected_direction)
    pass

def on_button_pressed_b():
    global current_is_run

    current_is_run = 0
    engine_stop()
    pass

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


def handle_speed(speed: number):
    global current_is_run
    global current_direction
    global current_speed
    #basic.show_number(speed)
    if current_speed == speed:
        return
    current_speed = speed
    engine_run(current_direction, current_speed)

def handle_location(curret_location:str):
    global current_location
    global current_direction
    global current_speed

    current_speed=30

    location_array=current_location.split(",")
    basic.show_string("a")
    for i in location_array:
        if i=='l':
            current_direction=1
            engine_run(current_direction, current_speed)
            basic.pause(1000)

        elif i=='r':
            current_direction=2
            engine_run(current_direction, current_speed)
            basic.pause(1000)
        
        else:
            forward_time=int(i)
            current_direction=3
            engine_run(current_direction, current_speed)
            basic.pause(forward_time*1000)
    basic.pause(100)


    


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
    motor.motor_run(motor.Motors.M1, motor.Dir.CW, speed + 30)
    motor.motor_run(motor.Motors.M2, motor.Dir.CCW, speed + 30)
    basic.show_leds("""
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
    """)

    
    


def turn_left(speed: number):
    engine_stop()
    motor.motor_run(motor.Motors.M3, motor.Dir.CW, speed + 30)
    motor.motor_run(motor.Motors.M4, motor.Dir.CCW, speed + 30)
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