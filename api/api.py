from flask import Flask
from flask import request
import torch
from transformers import pipeline

app = Flask(__name__)

torch.manual_seed(0)
from transformers import GPT2Tokenizer, GPT2LMHeadModel
tokenizer = GPT2Tokenizer.from_pretrained('gpt2', add_prefix_space=True)
text_generator = pipeline("text-generation", model="gpt2")

@app.route('/words')
def get_words():
    context = request.args.get('context')
    generated_text = text_generator(context, max_length=len(context.split(' '))+10, num_return_sequences=1, top_k=50, pad_token_id=tokenizer.eos_token_id)
    firstIndexSpace = 1 if generated_text[0]['generated_text'][len(context)] == ' ' else 0
    return {'words': generated_text[0]['generated_text'][len(context) + firstIndexSpace:]}
