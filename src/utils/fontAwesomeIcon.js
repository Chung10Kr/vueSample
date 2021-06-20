

import Vue from "vue"; 
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; 
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons"; 
import { faAddressCard,faAngleDoubleLeft , faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons"; 


library.add(faTrashAlt); 
library.add(faAddressCard,faAngleDoubleLeft , faAngleDoubleRight); 
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-icon", FontAwesomeIcon);
