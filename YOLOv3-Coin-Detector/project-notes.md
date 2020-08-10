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

## Step 2 - Collecting image data

1. Gathered a random collection of Singapore coins.
2. Find various surfaces around the house for better variety of backgrounds.
3. Randomly scatter a set of coins on surfaces and take pictures with my iPhone.
4. Repeat above step 3 to get a number of images.

## Step 3 - Preprocessing images and annotation

**Preprocessing:** 

1. Images taken from my phone are in HEIC format, thus I converted them for HEIC to JPG format for easier 
handling later on.
2. Perform auto-orient of photos (to zero the EXIF orientation) using ImageMagick software.
3. Center-crop images to 800x800.

**Annotation**

![Annotation](/annotation.png)

Used labelImg image labelling software by tzutalin [github link](https://github.com/tzutalin/labelImg) 
to annotate the coins in the images in YOLO format.
