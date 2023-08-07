function toggleRightPane() {
    document.getElementById("grid-container").className = "grid-container-hiderightside";
    document.getElementById("grid-rightside-heading").className = "grid-rightside-heading-hide";
    document.getElementById("grid-rightside").className = "grid-rightside-hide";

};

export default toggleRightPane;