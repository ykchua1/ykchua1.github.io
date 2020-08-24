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

I also monitored the validation losses (8 images) to make sure that it does not start rising due to overfitting. The training 
process was stopped once the trajectory of the loss reduction started to flatten out.

Upon completion of the training, several test predictions were made using the trained model. The images below show the outputs 
of the trained detector:

![Overfitting](/overfit.png)

From the above image, we can see that there is a large difference in the performances of the model on the training dataset and 
the validation dataset. To my knowledge, this is a sign of overfitting of the model. My conjecture is that the model is finding 
the wrong patterns in the training set. The issue is further compounded by the small size of our dataset that makes it harder 
to generalise the predictions.

There are a few ways of dealing with the problem of overfitting. The ones that I intend to try (in order of priority) are as 
follows:

1. Replacing the model with a smaller one. A smaller model should be less likely to find wrong patterns in the dataset, hence 
reducing the tendency of overfitting.
2. Extend the dataset by data augmentation.
3. Extend the dataset by adding more sample images.

## Training detector on a simpler model - YOLOv3-tiny

The chosen model on which to train the detector on is the YOLOv3-tiny network.

The first step to training the detector on a simpler model would be to to ensure that the PyTorch model is able to load the 
YOLOv3-tiny config file. On my first attempt, the model was not able to load the config, as YOLOv3-tiny contains layers that was 
not present in the original YOLOv3 network. That layer is the **maxpool** layer. Thus, to parse and load the config, I had to 
add the follow code:

```python3
# If it is a maxpool layer
if (x["type"] == "maxpool"):
    size = int(x["size"])
    stride = int(x["stride"])
    if stride == 1:
	zeropad2d = nn.ZeroPad2d((0,1,0,1))
    else:
	zeropad2d = nn.ZeroPad2d((0,0,0,0))
    module.add_module("zeropad2d_{}".format(index), zeropad2d)
    maxpool = nn.MaxPool2d(size, stride=stride)
    module.add_module("maxpool_{}".format(index), maxpool)
```

As shown above, right before the maxpool layers I had to include a **nn.ZeroPad2d** layer. This solved the problem I faced in 
performing the forward function of the model, as the prediction feature maps to concatenate did not match in shape. I then found 
out that a padding layer was required in YOLOv3-tiny.

After some code refactoring and debugging, I was finally able to get the model to load the tiny model with the ability to more 
easily swap out different networks to test and train on. The results of the trained model is shown below:

![Tiny result](/tiny-result.jpg)

The training process was much faster than the original YOLOv3 network. I trained it using CPU on my laptop.

## Evaluation and whats next

Overall, I was satisfied with the detection results on the train image. It shows that the simpler model is still enough to pick 
out the variability in features of the coins. The speed at which it trained was nice as well. Barring some overlapping detections 
that can be fixed by tweaking the NMS parameters, the accuracy of the predictions looks good.

The validation image detection showed improvements in performance since the last time when I used the full-sized YOLOv3 network. 
The reason should be that less overfitting occured when using the simpler tiny version of YOLOv3. However, there is still much to 
improve.

Next time, I will be attempting to extend the training data, first using **data augmentation**.

