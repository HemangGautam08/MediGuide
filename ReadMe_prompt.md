# MediGuide Medical Instruction Model

Fine-tuned Mistral-7B model for medical question answering using prompt tuning.

## 1. Model & Strategy

### Base Model
- **Model**: `mistralai/Mistral-7B-Instruct-v0.3`
- **Architecture**: Transformer-based causal language model

### Fine-tuning Strategy
- **Approach**: Parameter-Efficient Fine-Tuning (PEFT) via Prompt Tuning
- **Trainable Parameters**: 81,920 (0.0011% of total parameters)
- **Tuning Configuration**:
  - Prompt initialization: Medical domain-specific initialization
  - Virtual tokens: 100
  - Task type: Causal language modeling

### Key Features
- 4-bit quantization with NF4 type
- Flash Attention optimization
- Gradient checkpointing
- Paged AdamW optimizer

## 2. Data

### Dataset
- **Source**: Sampled medical instruction dataset (`sampled_6000.json`)
- **Size**: 6,000 doctor-patient interactions
- **Format**: Instruction-Input-Output triples
- **Sample Structure**:
  ```json
  {
    "instruction": "As a doctor, answer medical questions",
    "input": "Patient symptom description...",
    "output": "Doctor response..."
  }
## 3. Training Setup

### Hardware
- **Platform**: Google Colab Pro  
- **GPU**: NVIDIA T4 or V100  
- **VRAM**: ~15GB  

### Hyperparameters
| Parameter                | Value          |
|--------------------------|----------------|
| Batch size               | 2              |
| Gradient accumulation    | 4              |
| Learning rate            | 3e-2           |
| Epochs                   | 3              |
| Max steps                | 1900           |
| Optimizer                | Paged AdamW 32-bit |
| LR scheduler             | Constant       |
| Weight decay             | 0.01           |

### Training Process
- **Duration**: ~6 hours (for 1900 steps)  
- **Checkpoints**: Saved every 50 steps  
- **Final Loss**: 2.00  
- **Resume Capability**: Automatic checkpoint detection  

---

## 4. Testing & Evaluation

### Metrics
| Metric          | Value    |
|-----------------|----------|
| Perplexity      | 15.69    |
| ROUGE-1         | 0.2593   |
| ROUGE-2         | 0.0342   |
| ROUGE-L         | 0.1310   |
| ROUGE-Lsum      | 0.1595   |

### Performance
- **Average Latency**: 7.4 seconds/prompt (128 new tokens)  
- **Model Size**: 5.2 MB (prompt tuning parameters)  
- **Quantized Size**: 4.14 GB (4-bit base model)  

### Evaluation Dataset
- **Source**: Medical Instruction 120k (test split)  
- **Samples**: 5,609 doctor-patient interactions  
- **Evaluation Method**:  
  - Perplexity calculation  
  - ROUGE score comparison  
  - Human evaluation sample responses  








