import os
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# --- CONFIGURATION ---
# IMPORTANT: Before running this script, you MUST download a dataset.
# Example: Kaggle Paddy Disease Classification Dataset
# Extract it so the folder structure looks like this:
# dataset/
# ├── Bacterial_Blight/
# ├── Brown_Spot/
# ├── Healthy/
# └── Leaf_Blast/
DATASET_PATH = "dataset/" 
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20

def create_and_train_model():
    print(f"Loading dataset from: {DATASET_PATH}...")
    
    if not os.path.exists(DATASET_PATH):
        print(f"ERROR: Dataset folder '{DATASET_PATH}' not found!")
        print("Please download a dataset and place it in a 'dataset' folder next to this script.")
        return

    # 1. Load Data
    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_PATH,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_PATH,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    class_names = train_ds.class_names
    print(f"Found classes: {class_names}")

    # Save class names for the API to use later
    with open("class_names.txt", "w") as f:
        f.write("\n".join(class_names))

    # Optimize data loading performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    # 2. Build the Model (Transfer Learning with MobileNetV2)
    # We use a pre-trained model for much higher accuracy than training from scratch
    base_model = MobileNetV2(
        input_shape=IMG_SIZE + (3,),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze the base model
    base_model.trainable = False

    # Create the top layers for our specific classification
    model = models.Sequential([
        # Data Augmentation to prevent overfitting
        layers.RandomFlip("horizontal_and_vertical", input_shape=IMG_SIZE + (3,)),
        layers.RandomRotation(0.2),
        
        # Preprocessing required by MobileNetV2 (scales pixels from [0,255] to [-1,1])
        layers.Rescaling(1./127.5, offset=-1),
        
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.2),
        layers.Dense(len(class_names), activation='softmax')
    ])

    model.compile(
        optimizer='adam',
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=['accuracy']
    )

    model.summary()

    # 3. Train the Model
    callbacks = [
        EarlyStopping(patience=3, restore_best_weights=True),
        ModelCheckpoint("paddy_model.keras", save_best_only=True)
    ]

    print("Starting training...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks
    )

    print("\nTraining completed!")
    print("Model saved to: paddy_model.keras")

if __name__ == "__main__":
    create_and_train_model()
