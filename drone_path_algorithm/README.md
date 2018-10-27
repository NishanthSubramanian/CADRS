# DBPA and Algorithm Illustration
## Drones' Best Path Algorithm (DBPA)
This algorithm dictates the movement of drones, which all checkpoints (nodes) it has to make supplies to and in what order. Cost of travelling between two nodes depends on two attributes:
1. **urgency:** a quantative measure of how urgent a node needs supplies. Its a number between 0 and 100.
2. **distance** between the source and destination node.
## Algorithm Illustration
This illustration can be seen on https://cadrs.z13.web.core.windows.net . Using SVGs and some coordinate geometry we can make these illustrations to showcase the movement of these drones. Between one state and the next, the drone moves by 1 unit towards its destination node and in this way we can see which all nodes receive supplies and at what point of time. You can also see the table below the illustration getting updated everytime you change the state.
