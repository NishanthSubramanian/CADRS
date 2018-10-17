import argparse
import os
import numpy as np
import tensorflow as tf
import cv2

from multiprocessing import Queue, Pool
from threading import Thread
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as vis_util

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' # TF disable INFO, WARNING messages

PATH_TO_CKPT = 'model/frozen_inference_graph.pb' # Path to frozen detection graph (model)
PATH_TO_LABELS = 'model/mscoco_label_map.pbtxt' # Object labels for detection
NUM_CLASSES = 90 # Max number of classes
DEVICE_ID = 0 # Device ID of the default camera (webcam)
FRAME_WIDTH = 1024 # Width of the frame
FRAME_HEIGHT = 768 # Height of the frame

# Loading label map
label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
categories = label_map_util.convert_label_map_to_categories(
	label_map,
	max_num_classes=NUM_CLASSES,
	use_display_name=True)
category_index = label_map_util.create_category_index(categories)

class WebcamVideoStream:
	def __init__(self, src=0, width=640, height=480):
		# Initialize the stream
		self.stream = cv2.VideoCapture(src)
		# Set window width and height
		self.stream.set(cv2.CAP_PROP_FRAME_WIDTH, width)
		self.stream.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
		# Read the first frame
		(self.grabbed, self.frame) = self.stream.read()
		# Indicate if the thread should be stopped
		self.stopped = False

	def start(self):
		# Start the thread to read frames from the video stream
		Thread(target=self.update, args=()).start()
		return self
 
	def update(self):
		# Keep looping infinitely until the thread is stopped
		while True:
			# If the thread indicator variable is set, stop the thread
			if self.stopped:
				return
			# Otherwise, read the next frame from the stream
			(self.grabbed, self.frame) = self.stream.read()
 
	def read(self):
		# Return the frame most recently read
		return self.grabbed, self.frame
 
	def stop(self):
		# Indicate that the thread should be stopped
		self.stopped = True

def detect_objects(image_np, sess, detection_graph):
	# Expand dimensions since the model expects images to have shape
	image_np_expanded = np.expand_dims(image_np, axis=0)
	image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
	# Each box represents a part of the image where a particular object was detected.
	boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
	# Each score represent how level of confidence for each of the objects.
	# Score is shown on the result image, together with the class label.
	scores = detection_graph.get_tensor_by_name('detection_scores:0')
	classes = detection_graph.get_tensor_by_name('detection_classes:0')
	num_detections = detection_graph.get_tensor_by_name('num_detections:0')
	# Actual detection.
	(boxes, scores, classes, num_detections) = sess.run(
		[boxes, scores, classes, num_detections],
		feed_dict={image_tensor: image_np_expanded})
	# Visualization of the results of a detection.
	vis_util.visualize_boxes_and_labels_on_image_array(
		image_np,
		np.squeeze(boxes),
		np.squeeze(classes).astype(np.int32),
		np.squeeze(scores),
		category_index,
		use_normalized_coordinates=True,
		line_thickness=8)
	return image_np

def worker(in_queue, out_queue):
	# Load a frozen Tensorflow model into memory.
	detection_graph = tf.Graph()
	with detection_graph.as_default():
		od_graph_def = tf.GraphDef()
		with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
			serialized_graph = fid.read()
			od_graph_def.ParseFromString(serialized_graph)
			tf.import_graph_def(od_graph_def, name='')
		sess = tf.Session(graph=detection_graph)
	# Send queued frames for object detection
	while True:
		frame = in_queue.get()
		frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
		out_queue.put(detect_objects(frame_rgb, sess, detection_graph))
	sess.close()

def main(args):
	# Multiprocessing: input and output queue and pool of workers
	in_queue = Queue(maxsize=args["queue_size"])
	out_queue = Queue(maxsize=args["queue_size"])
	pool = Pool(args["num_workers"], worker, (in_queue, out_queue))
	# Create a threaded video stream
	camstream = WebcamVideoStream(
        src=DEVICE_ID,
        width=FRAME_WIDTH,
        height=FRAME_HEIGHT).start()
	while True:
		# Capture frame-by-frame
		ret, frame = camstream.read()
		if ret:
			in_queue.put(frame)
			output_rgb = cv2.cvtColor(out_queue.get(), cv2.COLOR_RGB2BGR)
			# Display the resulting frame
			cv2.imshow('frame', output_rgb)			 
		else:
			break
		# Exit by pressing 'e'
		if cv2.waitKey(1) & 0xFF == ord('e'):
			break
	pool.terminate()
	camstream.stop()
	cv2.destroyAllWindows()

if __name__ == '__main__':
	argParser = argparse.ArgumentParser()
	# Two arguments can be passed: number of workers and size of the queue (frames)
	argParser.add_argument('-w', '--num-workers', dest='num_workers', type=int,
							default=2, help='Number of workers.')
	argParser.add_argument('-q-size', '--queue-size', dest='queue_size', type=int,
							default=5, help='Size of the queue.')
	args = vars(argParser.parse_args())
	main(args)
