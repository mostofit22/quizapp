# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='build', static_url_path='')

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Serve React static files (JS, CSS, images)
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)




with open("questions.json") as f:
    questions_data = json.load(f)

@app.route("/questions/<topic>", methods=["GET"])
def get_questions(topic):
    return jsonify(questions_data.get(topic, []))

@app.route("/answer", methods=["POST"])
def check_answer():
    data = request.get_json()
    topic = data.get("topic")
    question_id = data.get("question_id")
    selected = data.get("selected_option")

    questions = questions_data.get(topic, [])
    for q in questions:
        if q["id"] == question_id:
            return jsonify({
                "correct": selected == q["correct_option"],
                "correct_option": q["correct_option"]
            })
    return jsonify({"error": "Invalid question ID"}), 400

@app.route('/')
def index():
    return 'Flask backend is running!'


if __name__ == "__main__":
    app.run()