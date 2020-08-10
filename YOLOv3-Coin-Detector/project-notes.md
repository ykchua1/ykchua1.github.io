# Project Notes: YOLOv3 Coin Detector

![Scattered Coins](/IMG_0046.jpg)

## Overview

The goal of this project is to get acquainted with deep learning object detection by training a YOLOv3
network implemented in PyTorch.

Instead of pulling public datasets from such as VOC or COCO to train the YOLOv3 network, I will be making 
an attempt to construct one myself. To start things off simple, I have decided to build a 4-class coin 
dataset (Singapore currency).

The aim would be to eventually train a coin detection system accurate enough to reliably estimate the 
total value of all the coins present in a given image.

## Step 1 - Reading the YOLO papers

To start off the project, I read through the papers regarding the YOLO (You Only Look Once) from versions 
1 to 3, to understand the overall workings behind the architecture. The links to the papers below:

- [YOLO](https://arxiv.org/pdf/1506.02640.pdf)
- [YOLOv2 and YOLO9000](https://arxiv.org/pdf/1612.08242.pdf)
- [YOLOv3](https://arxiv.org/pdf/1804.02767.pdf)
