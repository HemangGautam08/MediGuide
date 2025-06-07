
# Mediguide QLoRA Report

## 1. Model & Strategy  
- **Base model**: `deepseek-ai/deepseek-coder-1.3b-instruct`  
- **Fine-tuning**: QLoRA (4-bit quantized backbone + LoRA adapters)  
  - **BitsAndBytes quantization**  
    - 4-bit precision, NF4 quant type  
    - Compute dtype = `float16`  
    - Nested quantization = `False`  
  - **LoRA adapter**  
    - Rank (`r`): 64  
    - Alpha: 16  
    - Dropout: 0.1  
    - Bias mode: `none`  
    - Task type: `CAUSAL_LM`

## 2. Data  
- **Dataset**: `Mohammed-Altaf/medical-instruction-120k` (via 🤗 Datasets)  
- **Processing**:  
  - Extract “instruction” (between `[|Human|]` and `[|AI|]`)  
  - Extract “response” (text after last `[|AI|]`)  
  - Train/dev/test split as provided by the Hub  

## 3. Training Setup  
- **Frameworks**: PyTorch, HuggingFace Transformers + Accelerate, PEFT, TRL SFTTrainer  
- **Key hyperparameters** (via `TrainingArguments`)  
  - `num_train_epochs`  
  - `per_device_train_batch_size` & `gradient_accumulation_steps`  
  - Optimizer (`optim`), learning rate, weight decay  
  - Mixed precision: `fp16`/`bf16` flags  
  - Scheduler: warmup ratio, `lr_scheduler_type`  
  - Checkpointing: save every N steps, limit total checkpoints  
  - Logging: TensorBoard reporting, logging_steps  

## 4. Testing & Evaluation  
1. **Generative inference** on test split  
   - Sampling: `temperature=0.8`, `top_p=0.9`, `top_k=50`  
   - Constraints: `no_repeat_ngram_size=3`, `repetition_penalty=1.2`  
2. **Metrics**  
   - **ROUGE** (1, 2, L) over generated vs. reference
     - Rouge 1 ≈ 0.187
     - Rouge 2 ≈ 0.0189
     - Rouge L ≈ 0.0952
   - **Perplexity**  
     - Avg. token-loss ≈ 2.7394  
     - Test perplexity ≈ 15.48  
   - **Latency**  
     - Measured per-prompt for 128 new tokens  
     - Avg. latency ≈ 4.1880 s  
3. **Model Size**  
   - On-disk size of the QLoRA checkpoint directory 228.2 MB

