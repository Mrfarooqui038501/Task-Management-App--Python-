import pytest
import json
from app import create_app, db
from app.models import Task, Comment

@pytest.fixture
def client():
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False
    })

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        # teardown done automatically

def create_task_helper(client, title='Test Task'):
    rv = client.post('/api/tasks/', json={'title': title})
    assert rv.status_code == 201
    return rv.get_json()

def test_add_comment(client):
    task = create_task_helper(client)
    task_id = task['id']
    rv = client.post(f'/api/tasks/{task_id}/comments', json={'content': 'First comment', 'author': 'Alice'})
    assert rv.status_code == 201
    data = rv.get_json()
    assert data['content'] == 'First comment'
    assert data['author'] == 'Alice'
    assert data['task_id'] == task_id

def test_list_comments(client):
    task = create_task_helper(client)
    task_id = task['id']
    client.post(f'/api/tasks/{task_id}/comments', json={'content': 'Comment 1'})
    client.post(f'/api/tasks/{task_id}/comments', json={'content': 'Comment 2'})
    rv = client.get(f'/api/tasks/{task_id}/comments')
    assert rv.status_code == 200
    arr = rv.get_json()
    assert len(arr) == 2
    assert arr[0]['content'] == 'Comment 1'

def test_edit_comment(client):
    task = create_task_helper(client)
    task_id = task['id']
    rv = client.post(f'/api/tasks/{task_id}/comments', json={'content': 'Old'})
    comment = rv.get_json()
    comment_id = comment['id']
    rv = client.put(f'/api/comments/{comment_id}', json={'content': 'Updated', 'author': 'Bob'})
    assert rv.status_code == 200
    updated = rv.get_json()
    assert updated['content'] == 'Updated'
    assert updated['author'] == 'Bob'

def test_delete_comment(client):
    task = create_task_helper(client)
    task_id = task['id']
    rv = client.post(f'/api/tasks/{task_id}/comments', json={'content': 'to delete'})
    comment_id = rv.get_json()['id']
    rv = client.delete(f'/api/comments/{comment_id}')
    assert rv.status_code == 200
    # ensure it's gone
    rv = client.get(f'/api/tasks/{task_id}/comments')
    assert rv.status_code == 200
    assert all(c['id'] != comment_id for c in rv.get_json())
