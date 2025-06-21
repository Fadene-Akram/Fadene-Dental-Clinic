from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer


@api_view(['GET'])
def list_tasks(request):
    """
    Return tasks grouped by status
    """
    tasks = Task.objects.all()
    grouped_tasks = {
        'New': TaskSerializer(tasks.filter(status='New'), many=True).data,
        'Scheduled': TaskSerializer(tasks.filter(status='Scheduled'), many=True).data,
        'In_Progress': TaskSerializer(tasks.filter(status='In_Progress'), many=True).data,
        'Completed': TaskSerializer(tasks.filter(status='Completed'), many=True).data,
    }
    return Response(grouped_tasks)

@api_view(['POST'])
def move_task(request, id):
    """
    Move a task from one status to another
    """
    print("Moving task with ID:", id)
    try:
        task = Task.objects.get(pk=id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    if not new_status:
        return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if new_status not in dict(Task.STATUS_CHOICES):
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
    
    if task.status == 'New' and new_status == 'Scheduled' and not task.due_date:
        due_date = request.data.get('due_date')
        if not due_date:
            return Response(
                {"error": "Due date is required when moving from New to Scheduled"},
                status=status.HTTP_400_BAD_REQUEST
            )
        task.due_date = due_date
    
    task.status = new_status
    task.save()
    return Response(TaskSerializer(task).data)

@api_view(['POST'])
def create_task(request):
    """
    Create a task with automatic status and color assignment
    """
    data = request.data.copy()
    
    # Determine the status based on due date
    data['status'] = 'Scheduled' if data.get('due_date') else 'New'
    
    # Assign a color
    task_colors = ["rgb(228, 255, 251)", "#e0edfa", "#dff9fa"]
    count = Task.objects.filter(status=data['status']).count()
    data['color'] = task_colors[count % len(task_colors)]
    
    serializer = TaskSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_task(request, pk):
    """
    Delete a task
    """
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
    
    task.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def update_task(request, pk):
    """
    Update a task
    """
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


