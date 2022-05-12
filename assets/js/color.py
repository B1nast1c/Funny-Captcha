import cv2
import random
from collections import Counter
from sklearn.cluster import KMeans
from matplotlib import colors
import matplotlib.pyplot as plt
import numpy as np

directory = '../Images/'
Images = ['Blue1.jpg', 'Pink1.jpg', 
          'Pink2.jpg', 'Purple1.jpg', 
          'Red1.jpg', 'Red2.jpg']

posicion = random.randint(0, len(Images)-1)
readstr = directory + Images[posicion] #Important

def rgb_to_hex(rgb_color):
        hex_color = "#"
        for i in rgb_color:
            i = int(i)
            hex_color += ("{:02x}".format(i))
        return hex_color

def getColor(img):
    img = img.reshape(img.shape[0]*img.shape[1], 3)
      
    clf = KMeans(n_clusters = 5)
    color_labels = clf.fit_predict(img)
    center_colors = clf.cluster_centers_    
    counts = Counter(color_labels)
    ordered_colors = [center_colors[i] for i in counts.keys()]
    hex_colors = [rgb_to_hex(ordered_colors[i]) for i in counts.keys()]
    return hex_colors[:3]

def Init():
    img = cv2.imread(readstr)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    color = getColor(img)
    f = open("colors.txt", "r+")
    for i in color:
        f.write(i)
        f.write('\n')
    f.close()

Init()