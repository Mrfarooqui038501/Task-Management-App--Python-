from flask import Blueprint, request, jsonify, current_app
from ..models import Task, Comment
from .. import db

bp = Blueprint('comments', __name__)

# List comments for a task
@bp.route('/tasks/<int:task_id>/comments', methods=['GET'])
def list_comments(task_id):
    # ensure task exists; will return 404 if missing
    Task.query.get_or_404(task_id)
    comments = Comment.query.filter_by(task_id=task_id).order_by(Comment.created_at.asc()).all()
    return jsonify([c.to_dict() for c in comments]), 200

# Add a comment to a task
@bp.route('/tasks/<int:task_id>/comments', methods=['POST'])
def add_comment(task_id):
    Task.query.get_or_404(task_id)  # ensure task exists

    # parse JSON safely
    try:
        data = request.get_json(force=False, silent=False)
    except Exception as e:
        current_app.logger.debug(f"add_comment - JSON parse error: {e}")
        return jsonify({'error': 'Malformed JSON or wrong Content-Type header', 'detail': str(e)}), 400

    current_app.logger.debug(f"DEBUG add_comment - raw request.get_json(): {data!r}")

    if not data:
        return jsonify({'error': 'No JSON body found; send JSON with Content-Type: application/json'}), 400

    # Accept either 'content' (preferred) or 'text' (compatibility with older frontends)
    content = data.get('content')
    if content is None:
        content = data.get('text')  # fallback

    if not content or str(content).strip() == '':
        return jsonify({'error': 'content is required and cannot be empty'}), 400

    author = data.get('author') or data.get('name')  # small extra fallback
    comment = Comment(task_id=task_id, content=content.strip(), author=(author.strip() if author else None))
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201

# Edit comment by id
@bp.route('/comments/<int:comment_id>', methods=['PUT'])
def edit_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    data = request.get_json() or {}
    if 'content' in data:
        if not data.get('content'):
            return jsonify({'error':'content cannot be empty'}), 400
        comment.content = data.get('content')
    if 'author' in data:
        comment.author = data.get('author')
    db.session.commit()
    return jsonify(comment.to_dict()), 200

# Delete comment by id
@bp.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'deleted'}), 200
