from django.urls import path
from .views import list_tasks, move_task, create_task,delete_task,update_task

urlpatterns = [
    path('', list_tasks, name='list_tasks'),
    path('move/<int:id>/', move_task, name='move_task'),
    path('create/', create_task, name='create_task'),
    path('delete/<int:pk>/', delete_task, name='delete_task'),
    path('<int:pk>/', update_task, name='update_task')

]