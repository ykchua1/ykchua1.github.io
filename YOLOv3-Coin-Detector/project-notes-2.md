# Project Notes: YOLOv3 Coin Detector Part II

## Previously..

[Project Notes Part I](/project-notes.md)

![Annotation](/annotation.png)

Thus far, I have performed the annotation of pictures of scattered coins on random surfaces. I have also 
pulled a Github repo of a PyTorch implementation of a COCO objects detector. Although this implementation 
only performs inference, not training, I shall be using the code as a baseline and reference for my own 
training script.

## Understanding the loss function

![Loss func](/loss-func.PNG)

The equation above shows the loss function for YOLOv1. However, as far as I understand, YOLOv3 uses a modified 
version of the one shown above.

**Difference 1:**

In YOLOv1, the coordinate values used in the loss calculation is x, y, sqrt(w) and sqrt(h). On the other hand, 
YOLOv3 uses the t<sub>x</sub>, t<sub>y</sub>, ... values instead.

**Difference 2:**

In YOLOv1, the losses for objectness confidence scores and class confidence scores are computed using a 
squared-error loss function. In YOLOv3 however, cross-entropy loss is applied instead. Additionally, the 
objectness and class confidence values runs through a final sigmoid layer in the forward function of the network.

### Overall strategy for computing the loss tensor

![Loss func 2](/loss-function.jpg)

The overall loss (total loss) can be divided into 3 parts: 

1. The squared error loss consisting of the coordinate error (x, y, w, h).
2. Cross entropy loss (negative log-likelihood) for the objectness scores and class confidence scores of the 
**assigned** bounding boxes.
3. Cross entropy loss (negative log-likelihood) for the objectness scores only, for **unassigned** bounding 
boxes.

The \lambda values are used for weighting these 3 losses. 

## Transfer learning

The main idea is to take the weights of the original 80-class COCO objects detector, and transfer it to my own 
4-class coins detector. Therefore, the feature extracting capabilities of the original network is preserved.

However, since the original network outputs (5 + num_classes)-column tensors, where num_classes is 80, it is 
required to perform some slight modifications to the network. We are going to swap out the Conv2D layers just 
before the YOLO layers, as shown below:

![Swapping](/swapping.PNG)

After swapping out the Conv2D layers, the model is only going to produce wrong outputs since no training of the 
weights has been performed on the swapped-in layers. Therefore, it is time to do a test-training loop with this 
modified network.

## Test-training results

Just as a proof of concept, I have trained the network on my dataset for 5 epochs. I used 21 training images and 
8 validation images.

The progression of the total loss during the test-training run is plotted as follows:

![Training progress](/training-progress.png)

The training seems to work fine. Next, I wrote a detection (inference) script to detect the objects, run the 
outputs throught objectness confidence thresholding and NMS, and draw the bounding boxes and their 
classifications.

![Draw the results](/sample-detection.PNG)

The above image shows the results of detection for one of the validation images.

## Evaluation of testing results

The results of the detector trained for just 5 epochs show some promise, although there is plenty to be improved 
upon.

The detection image shows that the model is able to successfully perform object detection, as seen from the 
bounding boxes over each individual coin. However, the classification performance and the bounding-box center 
coordinates (x, y) and the dimensions (w, h) seem to be weak.

In conclusion, we now know that our training works to some extent.

## What's next?

The next step of this project would be to solve the deficiencies of the detector, namely the classification 
performance.

To improve the classification performance, the model probably requires further training, as the model is very 
lightly trained at this point in time. Additionally, I plan to tweak the weighting of the losses to see if the 
classification performance improves.

I also planned some other improvements to the training methodology. Firstly, I wish to change the original 
anchor boxes to something more suitable for this particular application. The original anchors are not ideal, 
since they are used for more general objects with greatly varying sizes. Coins, on the other hand, are more 
uniform in size. Changing anchors sizes to more closely match the coins would increase the bounding boxes loss 
representation, since the IOUs of nearest bounding box with the objects would improve.

There is also a slight difference from my current loss function and the one prescribed by the YOLOv3 paper. 
While the paper uses t<sub>\*</sub> values for the coordinate losses, I used coordinate values of range [0-416] 
instead. Thus, I would like to experiment using the prescribed method to see if it impacts the results.

[Go to Project Notes Part III](/project-notes-3.md)
