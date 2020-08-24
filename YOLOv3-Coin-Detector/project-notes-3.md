# Project Notes: YOLOv3 Coin Detector Part III

## Previously.. in [Part II](/project-notes-2.md)

![Draw the results](/sample-detection.PNG)

We had shown the potential of the YOLOv3 network in performing the task of object detection. As seen in the image above, the 
model is able to pick out every one of the coins captured in the image. However, since the model had only been trained on less 
than 10 epochs, the performance is not yet satisfactory (particularly the object classification performance).

Our task then, is to complete more training epochs to check out the performance of a fully trained YOLOv3 model.

  *Some notes about the training dataset that I had not mentioned previously*
  
  * In total, 29 images of scattered coins were taken.
  * Out of these images, 21 randomly selected images were taken out to be used for training.
  * The dataset is admittedly small due to limited resources. This presents a greater challenge in training the model.

Before we proceed to further train the model, I thought that I should change out bounding box priors (anchors) to better fit the 
the model on my custom coins dataset.

## Finding better bounding box priors (anchors)

The original anchors were tailored to the COCO image dataset. Hence, these dimension priors have larger variance to cater for a 
wide range of object sizes and scales. The original set of anchors are shown below:

`10,13,  16,30,  33,23,  30,61,  62,45,  59,119,  116,90,  156,198,  373,326`

From the example image taken out of the COCO dataset (left), we can see the the objects in the image have a wide variety of 
shapes and sizes. On the other hand, the bounding boxes for coins (right) are more uniform in size and shape. Therefore, the 
big variance in the original set of anchors may reduce the participation of many bounding boxes in the detection of coins.

![COCO vs Coins](/cocovscoins.png)

### Using k-means clustering to fit anchor sizes

In order to select appropriate anchor sizes for our coin-detection model, we used the k-means clustering algorithm. On our 21 
image dataset, we applied the KMeans function from the SKLearn library to get 9 cluster points. The output is show below:

`[(39,38),  (45,44),  (49,49),  (70,36),  (54,53),  (58,58),  (64,62),  (69,68),  (76,75)]`

As expected, the variance in the sizes and shapes of the tuples are fairly low as compared to the general COCO set.

## Full training of the YOLOv3 model.. and overfitting

After we had changed out the anchors for our model, we trained the model for approximately 100 epochs. During training, I closely 
monitored the trajectory of each individual components of the losses. They are the coordinate loss, the classifier and objectness 
loss, and the no-object loss. During a few intervals, I tweaked the weights of these components in order to keep their loss 
balanced.

I also monitored the validation losses (8 images) to make sure that it does not start rising due to overfitting.The training 
process was stopped once the trajectory of the loss reduction started to flatten out.

Upon completion of the training, several test predictions were made using the trained model. The images below show the outputs 
of the trained detector:

![Overfitting](/overfit.png)
