# Project Notes: YOLOv3 Coin Detector Part IV

## Previously, in [Part III](/project-notes-3.md)

We changed out the model from a large one (YOLOv3) to a much smaller one (YOLOv3-tiny), and found out that the 
smaller model works better for our dataset. The smaller model is less likely to overfit on the dataset, and we 
have also shown that the smaller model is able to fit on the dataset by looking at the results on the train 
images.

The result of the detection task on the validation images, despite having improved since we have switched the 
models, still leaves something to be desired. This is due to the small dataset (21 train images) that we are 
using.

# Experiments on ways to improve the model training on small dataset

In this part, we will explore ways to improve the model training on a small dataset such as ours. The methods 
tested that fall under the category of **data augmentation** are listed here:

  1. 90-degree rotations on the base images
  2. Randomly generated rotations on training (using a dataloader pipeline)

## 1. 90-degree rotations on the base images

This is performed by simply rotating the base images by intervals of 90 degrees, and adding the rotated images 
to the dataset.

We have experimented with the number of such rotations performed on the base images. Altogether, 3 augmented 
datasets were tested and evaluated: 90-degree only; 90-degree + 180-degree; and 90-degree + 180-degree + 
270-degree.

The results of the tests are shown here:

![90-deg](/data-aug-study/rot90loss.png)

From the chart above, we can see that in general, the more the number of rotations added, the better the results.
However, the gains start to diminish the more number of rotations we add. This suggests that rotations alone may 
not be sufficient to improve the statistical distribution of the images.

## 2. Randomly generated rotations

This method is an improvement on the simple 90-degree rotation method used above. An example of such rotation is 
as shown:

![randrot](/data-aug-study/randrotate.png)

We implemented this by using the PyTorch dataset/dataloader API to help us with the image transformations. In 
doing so, it is much more convenient to implement other types of pipeline transformations in the future.

For this method, we had to write additional code to transform the annotation data as well, to match up with the 
image rotations. The simple 2D rotation matrix was used for this purpose:

<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mrow>
    <mo>[</mo>
    <mtable rowspacing="4pt" columnspacing="1em">
      <mtr>
        <mtd>
          <mi>c</mi>
          <mi>o</mi>
          <mi>s</mi>
          <mi>&#x03B8;<!-- θ --></mi>
        </mtd>
        <mtd>
          <mo>&#x2212;<!-- − --></mo>
          <mi>s</mi>
          <mi>i</mi>
          <mi>n</mi>
          <mi>&#x03B8;<!-- θ --></mi>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mi>s</mi>
          <mi>i</mi>
          <mi>n</mi>
          <mi>&#x03B8;<!-- θ --></mi>
        </mtd>
        <mtd>
          <mi>c</mi>
          <mi>o</mi>
          <mi>s</mi>
          <mi>&#x03B8;<!-- θ --></mi>
        </mtd>
      </mtr>
    </mtable>
    <mo>]</mo>
  </mrow>
</math>


The results are shown as follows:

![randrotloss](/data-aug-study/randrotateloss.png)

We observe that the random rotation method performs slightly better than the 90-180-270 degree rotations used 
earlier. In addition, the training time per epoch is also much faster since the dataset size remains at 21 
images and the rotations are performed on the fly. We shall stick to this augmentation method in the future.

## Data proprocessing methods

In addition, we have also tested **data preprocessing** methods shown below:

  1. Image filter using the FIND_EDGES kernel

Using the PIL module, we added an image filter to the pipeline of transformations. An example of a filtered 
image is shown here:

![findedges](/data-aug-study/findedges.png)

This image is filtered using the edge detection kernel. We test the effectiveness of the filter in the training 
performance:

![randrotedge](/data-aug-study/randrotatefindedgeloss.png)

Not very effective when compared to the plain old random rotation transformation..

## Summary of the methods we have tried so far:

  1. 90-degree interval rotations: Good
  2. Random rotations: Better
  3. Edge detection filter: Not good

We will update this page as more methods are tested. Thank you for reading.
