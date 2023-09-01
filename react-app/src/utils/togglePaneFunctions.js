export function toggleLeftPane() {

    if (document.getElementById("grid-container")) {

      if ((document.documentElement.clientWidth > 1027 ||
        document.documentElement.clientWidth >= 768) && document.getElementById("grid-container").className === 'grid-container-hiderightside'
      ) {
        document.getElementById("grid-leftside-heading").className = "grid-leftside-heading-threecolumn";
        document.getElementById("grid-leftside").className = "grid-leftside-threecolumn";
        document.getElementById("grid-content-heading").className = "grid-content-heading-threecolumn";
        document.getElementById("grid-content").className = "grid-content-threecolumn";
        document.getElementById("grid-editor").className = "grid-editor-threecolumn";
        document.getElementById("hideshow-leftpane-hamburger").style.display = "none";
        document.getElementById("hideshow-leftpane-arrow").style.display = "none";
      } else {
        document.getElementById("grid-leftside-heading").className = "grid-leftside-heading-closed";
        document.getElementById("grid-leftside").className = "grid-leftside-closed";
        document.getElementById("grid-content-heading").className = "grid-content-heading";
        document.getElementById("grid-content").className = "grid-content";
        document.getElementById("grid-editor").className = "grid-editor";
        document.getElementById("hideshow-leftpane-hamburger").style.display = "block";
        if (document.getElementById("grid-leftside-heading").className === "grid-leftside-heading-closed") {
          document.getElementById("hideshow-leftpane-hamburger").style.display = "block";
          document.getElementById("hideshow-leftpane-arrow").style.display = "none";
        } else {
          document.getElementById("hideshow-leftpane-hamburger").style.display = "none";
          document.getElementById("hideshow-leftpane-arrow").style.display = "block";
        }
      }
    }
  };

export function hideShowLeftPane() {
    if (document.getElementById("grid-leftside-heading").className === "grid-leftside-heading-closed") {
      document.getElementById("grid-leftside-heading").className = "grid-leftside-heading"
      document.getElementById("grid-leftside").className = "grid-leftside";
      document.getElementById("hideshow-leftpane-hamburger").style.display = "none";
      document.getElementById("hideshow-leftpane-arrow").style.display = "block";
      changedViewChannelsToOpen();
    } else {
      document.getElementById("grid-leftside-heading").className = "grid-leftside-heading-closed"
      document.getElementById("grid-leftside").className = "grid-leftside-closed";
      document.getElementById("hideshow-leftpane-hamburger").style.display = "block";
      document.getElementById("hideshow-leftpane-arrow").style.display = "none";
      changedViewChannelsToClosed();
    }
  }

export function adjustLeftPane(state) {
  if (state === "close") {
    document.getElementById("grid-leftside-heading").className = "grid-leftside-heading-closed"
    document.getElementById("grid-leftside").className = "grid-leftside-closed";
    document.getElementById("hideshow-leftpane-hamburger").style.display = "block";
    document.getElementById("hideshow-leftpane-arrow").style.display = "none";
    changedViewChannelsToClosed();
  } else {
    document.getElementById("grid-leftside-heading").className = "grid-leftside-heading"
    document.getElementById("grid-leftside").className = "grid-leftside";
    document.getElementById("hideshow-leftpane-hamburger").style.display = "none";
    document.getElementById("hideshow-leftpane-arrow").style.display = "block";
    changedViewChannelsToOpen();
  }
}

function changedViewChannelsToClosed() {
  if (document.querySelector(".view-all-channels")) {
    document.getElementsByClassName("view-all-channels")[0].className = "view-all-channels-left-closed";
  }
}

function changedViewChannelsToOpen() {
  if (document.querySelector(".view-all-channels-left-closed")) {
    document.getElementsByClassName("view-all-channels-left-closed")[0].className = "view-all-channels";
  }
}

export function toggleRightPane(state) {
  if (state === "close") {
    document.getElementById("grid-container").className =
      "grid-container-hiderightside";
    document.getElementById("grid-rightside-heading").className =
      "grid-rightside-heading-hide";
    document.getElementById("grid-rightside").className =
      "grid-rightside-hide";
  } else {
    document.getElementById("grid-container").className =
      "grid-container";
    document.getElementById("grid-rightside-heading").className =
      "grid-rightside-heading";
    document.getElementById("grid-rightside").className =
      "grid-rightside";
  }
  toggleLeftPane();
}
