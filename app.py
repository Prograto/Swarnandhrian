import requests
from flask import Flask, render_template, request,jsonify, redirect, url_for, session
import subprocess


app = Flask(__name__)
app.secret_key = 'Swarnandhrian website'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    user_type = request.form['user_type']
    user_id = request.form['user_id']
    password = request.form['password']


    apps_script_url = 'https://script.google.com/macros/s/AKfycbzETg1qICL3BEXYKikB1usB32l59jekxuBE5XLdkWceJcdBxbAVIqn07FKj_vVLs2bm/exec'
    payload = {'student_id': user_id, 'password': password}

    response = requests.post(apps_script_url, json=payload)
    result = response.json()

    if result['status'] == 'success':
        if user_type == 'student':
            session['student_id'] = user_id
            return redirect(url_for('student_page', student_id=user_id))
        elif user_type == 'staff':
            return f"Staff Login: ID = {user_id}, Password = {password}"
    else:
        return 'Invalid credentials', 401
    

@app.route('/student')
def student_page():
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('student.html', student_id=student_id)

@app.route('/logout')
def logout():
    session.pop('student_id', None)  
    return redirect(url_for('index'))

@app.route('/profile')
def profile():
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('profile.html', student_id=student_id)


@app.route('/competitor')
def competitor_page():
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('code_competitor.html', student_id=student_id)

@app.route('/logical_competitor')
def logical_competitor_page():
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('logical_competitor.html', student_id=student_id)

@app.route('/logical_concepts/<logical_concepts>')
def logical_concepts_page(logical_concepts):
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('logical_concepts.html', logical_concepts=logical_concepts, student_id=student_id)

@app.route('/<logical_concepts>/<logical_topics>')
def logical_topics_page(logical_concepts, logical_topics):
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('logical_topics.html', logical_concepts=logical_concepts, logical_topics=logical_topics, student_id=student_id)

@app.route('/<logical_concepts>/<logical_topics>/<level>')
def logical_test_page(logical_concepts, logical_topics, level):
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('test.html', logical_concepts=logical_concepts, logical_topics=logical_topics, level=level, student_id=student_id)

@app.route('/course_competitor')
def course_competitor_page():
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('course_competitor.html', student_id=student_id)

@app.route('/course_concepts/<course_concepts>')
def course_concepts_page(course_concepts):
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('course_concepts.html', course_concepts=course_concepts, student_id=student_id)


@app.route('/courses/<course_concepts>/<course_topics>')
def course_topics_page(course_concepts, course_topics):
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('course_topics.html', course_concepts=course_concepts, course_topics=course_topics, student_id=student_id)


@app.route('/courses/<course_concepts>/<course_topics>/<level>')
def course_test_page(course_concepts, course_topics, level):
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('course_test.html', course_concepts=course_concepts, course_topics=course_topics, level=level, student_id=student_id)

@app.route('/code_concepts/<code_concepts>')
def code_concepts_page(code_concepts):
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('code_concepts.html', code_concepts=code_concepts, student_id=student_id)

@app.route('/code_topic/<code_concept>/<code_topics>')
def code_topics_page(code_concept, code_topics):
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('code_topics.html', code_concept=code_concept, code_topics = code_topics, student_id=student_id)

@app.route('/coding_page/<problemTitle>')
def coding_page(problemTitle):
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('index'))
    return render_template('code_evaluator.html',student_id=student_id,problemTitle=problemTitle)

@app.route('/portfolio/<student_id>')
def portfolio(student_id):
    return render_template('portfolio.html',student_id=student_id)

@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.json
    code = data.get('code')
    language = data.get('language')
    inputs = data.get('inputs', [])
    expected_output = data.get('expectedOutput', [])

    # Prepare input data properly
    if isinstance(inputs, str):
        input_data = inputs + '\n'
    elif isinstance(inputs, list):
        input_data = '\n'.join(map(str, inputs)) + '\n'  # Convert each element to string if necessary
    else:
        input_data = str(inputs) + '\n'
    actual_output = ''
    print(input_data)
    try:
        if language == 'python':
            process = subprocess.Popen(
                ['python', '-c', code],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        elif language == 'javascript':
            process = subprocess.Popen(
                ['node', '-e', code],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        elif language == 'cpp':
            with open('temp.cpp', 'w') as f:
                f.write(code)
            subprocess.check_output(['g++', 'temp.cpp', '-o', 'temp'])
            process = subprocess.Popen(
                ['./temp'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        elif language == 'c':
            with open('temp.c', 'w') as f:
                f.write(code)
            subprocess.check_output(['gcc', 'temp.c', '-o', 'temp'])
            process = subprocess.Popen(
                ['./temp'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        elif language == 'java':
            with open('Temp.java', 'w') as f:
                f.write(code)
            subprocess.check_output(['javac', 'Temp.java'])
            process = subprocess.Popen(
                ['java', 'Temp'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        else:
            return jsonify({'output': 'Unsupported language.'})

        # Communicate input to the subprocess
        stdout, stderr = process.communicate(input=input_data.encode('utf-8'))
        if stderr:
            actual_output = stderr.decode('utf-8')
        else:
            actual_output = stdout.decode('utf-8')

        # Compare the actual output to expected output if provided
        if expected_output:
            if str(actual_output).strip() == str(expected_output).strip():
                result = "Correct Output!"
            else:
                result = f"Incorrect Output.\nExpected:\n{expected_output}\nGot:\n{actual_output}"
        else:
            result = actual_output

        return jsonify({'output': result})

    except subprocess.CalledProcessError as e:
        return jsonify({'output': e.output.decode('utf-8')})

    except Exception as e:
        return jsonify({'output': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
