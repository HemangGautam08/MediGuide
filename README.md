<div align="center">

<h1>
  <img src="public/logo.png" alt="MediGuide Logo" width="32" style="vertical-align: middle; margin-right: 8px;" />
  MediGuide: Your AI Medical Assistant
</h1>

</div>



**MediGuide** is an intelligent medical chatbot and research project powered by a fine-tuned **Mistral-7B-Instruct-v0.3** model. Trained on a custom medical dataset, it delivers trustworthy, context-aware, and conversational medical insights.

This project explores and compares multiple parameter-efficient fine-tuning techniques — **QLoRA**, **Prompt Tuning**, and **Prefix Tuning** — applied to large language models for the task of medical instruction following. The goal is to evaluate the trade-offs among these methods in terms of response quality, training efficiency, model size, and deployment performance.


![Demo Preview](demo/demo.gif)


> ⚠️ **Disclaimer:** MediGuide is intended for informational and research purposes only. It is not a substitute for professional medical advice.

---

# QLoRA vs Prompt Tuning vs Prefix Tuning

## 1. Overview

We fine-tuned `mistralai/Mistral-7B-Instruct-v0.3` model with two different techniques : 

- QLoRA-based fine-tuning
- Prompt Tuning
- Prefix Tuning

Model was trained on medical instruction datasets, and evaluated on response quality, perplexity, latency, and rouge scores.

---

## 2. Fine-Tuning Strategies

### QLoRA-based fine tuning

- **Base Model**: `mistralai/Mistral-7B-Instruct-v0.3`
- **Fine-Tuning Method**: QLoRA (Quantized Low-Rank Adaptation)
- **Quantization**: 4-bit precision using NF4 with `BitsAndBytes`
- **LoRA Config**:
  - Rank: 64
  - Alpha: 16
  - Dropout: 0.1
  - Bias: none
- **Mixed Precision**: float16
- Paged AdamW Optimizer
- **Frameworks**: HuggingFace Transformers, Accelerate, PEFT, TRL

### Prompt-Tuned 

- **Base Model**: `mistralai/Mistral-7B-Instruct-v0.3`
- **Fine-Tuning Method**: Prompt Tuning via PEFT
- **Trainable Parameters**: 81,920 (0.0011% of total model parameters)
- **Features**:
  - 4-bit quantization (NF4)
  - Flash Attention
  - Gradient Checkpointing
  - Paged AdamW Optimizer
- **Mixed Precision**: Training done in 32-bit precision for prompt vectors

### Prefix Tuning

- **Base Model**: `mistralai/Mistral-7B-Instruct-v0.3`
- **Fine-Tuning Method**: Prefix Tuning via PEFT
- **Trainable Parameters**: 272,719,872 (≈ 3.63% of total model parameters)  
  *(includes prefix projection MLPs with 20 virtual tokens across 32 layers)*
- **Features**:
  - 4-bit quantization (NF4)
  - Gradient Checkpointing
  - Paged AdamW Optimizer
- **Mixed Precision**: Training performed in 32-bit precision for prefix parameters

---

## 3. Datasets
- **Train**: [`sampled_6000`](https://github.com/ankraj1234/MediGuide/blob/master/sampled_6000.json)
- **Size**: ~6,000 examples
- **Test**: [`Mohammed-Altaf/medical-instruction-120k`](https://huggingface.co/datasets/Mohammed-Altaf/medical-instruction-120k)
- **Size**: ~1,000 examples

## 4. Comparative Score Summary

| Metric                 | QLoRA              | Prompt Tuning               | Prefix Tuning               |
|------------------------|--------------------|-----------------------------|-----------------------------|
| ROUGE-1                | 0.2398             | 0.2593                      | 0.1556                      |
| ROUGE-2                | 0.0307             | 0.0342                      | 0.0226                      |
| ROUGE-L                | 0.1212             | 0.1310                      | 0.0956                      |
| Perplexity             | 15.30              | 15.69                       | 333.69                      |
| Average Token Loss     | 2.7282             | 2.00                        | 5.81                        |
| Latency (128 tokens)   | ~7.2 sec           | ~7.4 sec                    | ~7.4 sec                    |
| Fine-Tuned Size        | 161.2 MB           | 5.2 MB                      | 9.2 MB                      |
| Quantized Model Size   | ~1.9 GB            | ~4.14 GB                    | ~2.04 GB                    |





