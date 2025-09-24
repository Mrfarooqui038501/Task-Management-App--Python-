from flask import Blueprint, request, jsonify, current_app
from ..models import Task
from .. import db

bp = Blueprint('tasks', __name__)

@bp.route('/', methods=['GET'])
def list_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tasks]), 200

@bp.route('/', methods=['POST'])
def create_task():
    data = request.get_json() or {}
    title = data.get('title')
    if not title:
        return jsonify({'error': 'title is required'}), 400
    task = Task(title=title, description=data.get('description'))
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

@bp.route('/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict()), 200

@bp.route('/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json() or {}
    title = data.get('title')
    if title is not None:
        task.title = title
    if 'description' in data:
        task.description = data.get('description')
    db.session.commit()
    return jsonify(task.to_dict()), 200

@bp.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'deleted'}), 200
