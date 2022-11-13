from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    url = url_for('static', filename='bundle.js')
    return render_template('index.html', bundle=url)

if __name__ == '__main__':
   app.run(debug=True)
