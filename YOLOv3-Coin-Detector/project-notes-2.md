# Project Notes: YOLOv3 Coin Detector Part II

## Previously..

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

![Loss func 2](/loss-function.jpg)

In YOLOv1, the coordinate values used in the loss calculation is x, y, sqrt(w) and sqrt(h). On the other hand, 
YOLOv3 uses the t<sub>x</sub>, t<sub>y</sub>, ... values instead.

**Difference 2:**

In YOLOv1, the losses for objectness confidence scores and class confidence scores are computed using a 
squared-error loss function. In YOLOv3 however, cross-entropy loss is applied instead. Additionally, the 
objectness and class confidence values runs through a final sigmoid layer in the forward function of the network.


