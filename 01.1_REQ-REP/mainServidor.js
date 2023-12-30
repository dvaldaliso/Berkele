
import ServerController from "./controller/serverController.js"
function main() {
    new ServerController("tcp://*","5555")
} 
main() 

