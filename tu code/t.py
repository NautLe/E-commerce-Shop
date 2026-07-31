import pygame
# Thiết lập màn hình
pygame.init()
screen = pygame.display.set_mode((640, 480))
# Tạo con rắn
snake = pygame.Rect(200, 200, 10, 10)
snake_color = (255, 0, 0)
# Tạo thức ăn
food = pygame.Rect(300, 300, 10, 10)
food_color = (0, 255, 0)
# Tạo danh sách các khối rắn
snake_blocks = [snake]
# Tốc độ rắn
snake_speed = 10
# Biến điều khiển hướng rắn
snake_direction = "up"
# Trạng thái trò chơi
game_over = False
# Vòng lặp trò chơi
while not game_over:
# Xử lý sự kiện
for event in pygame.event.get():
if event.type == pygame.QUIT:
game_over = True
if event.type == pygame.KEYDOWN:
if event.key == pygame.K_UP:
snake_direction = "up"
elif event.key == pygame.K_DOWN:
snake_direction = "down"
elif event.key == pygame.K_LEFT:
snake_direction = "left"
elif event.key == pygame.K_RIGHT:
snake_direction = "right"
# Cập nhật vị trí rắn
if snake_direction == "up":
snake.y -= snake_speed
elif snake_direction == "down":
snake.y += snake_speed
elif snake_direction == "left":
snake.x -= snake_speed
elif snake_direction == "right":
snake.x += snake_speed
# Kiểm tra va chạm với thức ăn
if snake.colliderect(food):
# Thêm khối mới vào rắn
snake_blocks.append(snake)
# Tạo thức ăn mới
food.x = random.randint(0, 630)
food.y = random.randint(0, 470)
# Kiểm tra va chạm với chính mình
for i in range(len(snake_blocks) - 1):
if snake_blocks[i].colliderect(snake):
game_over = True
break
# Vẽ màn hình
screen.fill((0, 0, 0))
for block in snake_blocks:
pygame.draw.rect(screen, snake_color, block)
pygame.draw.rect(screen, food_color, food)
pygame.display.update()
pygame.quit()