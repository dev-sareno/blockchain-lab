from threading import Thread

from flask import Flask

from blockchain import Blockchain

blockchain = Blockchain()


def thread_transaction_picker():
    while True:
        pass


Thread(target=thread_transaction_picker, daemon=True).start()

app = Flask(__name__)


@app.route('/', methods=['GET'])
def hello():
    return 'Hello World!'


# $ flask run --host=0.0.0.0 --port=5001 --reload
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)
