# MediGuide: QLoRA vs Prompt Tuning

**MediGuide** is a research project that compares two parameter-efficient fine-tuning techniques — **QLoRA** and **Prompt Tuning** — applied to large language models for the task of medical instruction following. The goal is to evaluate the trade-offs between these methods in terms of performance, resource usage, and deployment efficiency.

---

## 1. Overview

We fine-tune two models:

- **Model A**: QLoRA-based fine-tuning on `deepseek-ai/deepseek-coder-1.3b-instruct`
- **Model B**: Prompt Tuning on `mistralai/Mistral-7B-Instruct-v0.3`

Both are trained on medical instruction datasets, and evaluated on response quality, perplexity, and latency.

---

## 2. Fine-Tuning Strategies

### QLoRA Model (Model A)

- **Base Model**: `deepseek-ai/deepseek-coder-1.3b-instruct`
- **Fine-Tuning Method**: QLoRA (Quantized Low-Rank Adaptation)
- **Quantization**: 4-bit precision using NF4 with `BitsAndBytes`
- **LoRA Config**:
  - Rank: 64
  - Alpha: 16
  - Dropout: 0.1
  - Bias: none
- **Mixed Precision**: float16
- **Frameworks**: HuggingFace Transformers, Accelerate, PEFT, TRL

### Prompt-Tuned Model (Model B)

- **Base Model**: `mistralai/Mistral-7B-Instruct-v0.3`
- **Fine-Tuning Method**: Prompt Tuning via PEFT
- **Trainable Parameters**: 81,920 (0.0011% of total model parameters)
- **Virtual Tokens**: 100
- **Features**:
  - 4-bit quantization (NF4)
  - Flash Attention
  - Gradient Checkpointing
  - Paged AdamW Optimizer
- **Mixed Precision**: Training done in 32-bit precision for prompt vectors

---

## 3. Datasets

### Dataset 1: Full-scale (Used for QLoRA)

- **Source**: [`Mohammed-Altaf/medical-instruction-120k`](https://huggingface.co/datasets/Mohammed-Altaf/medical-instruction-120k)
- **Size**: ~120,000 examples
- **Processing**:
  - Extract instructions from `[|Human|]` to `[|AI|]`
  - Extract response from the last `[|AI|]` onward
- **Split**: Predefined train/dev/test

### Dataset 2: Sampled Subset (Used for Prompt Tuning)

- **File**: `sampled_6000.json`
- **Size**: 6,000 interactions
- **Structure**:
  ```json
  {
    "instruction": "As a doctor, answer medical questions",
    "input": "Patient symptom description...",
    "output": "Doctor response..."
  }

### Comparative Score Summary

| Metric                 | QLoRA (1.3B)       | Prompt Tuning (Mistral 7B) |
|------------------------|--------------------|-----------------------------|
| ROUGE-1                | 0.187              | 0.2593                      |
| ROUGE-2                | 0.0189             | 0.0342                      |
| ROUGE-L                | 0.0952             | 0.1310                      |
| Perplexity             | 15.48              | 15.69                       |
| Average Token Loss     | 2.7394             | 2.00                        |
| Latency (128 tokens)   | ~4.2 sec           | ~7.4 sec                    |
| Fine-Tuned Size        | 228.2 MB           | 5.2 MB                      |
| Quantized Model Size   | ~1.9 GB            | ~4.14 GB                    |

