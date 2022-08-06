def on_button_pressed_a():
    motor.servo(motor.Servos.S1, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S1, 0)
    basic.show_icon(IconNames.SQUARE)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    motor.servo(motor.Servos.S8, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S1, 0)
    basic.show_icon(IconNames.SMALL_SQUARE)
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_forever():
    basic.show_icon(IconNames.HAPPY)
basic.forever(on_forever)