const getCurrentUserClass = (id) => {
  const userId = $('#chat-user-id').val();
  return userId === id ? "current-user" : "";
};

$(document).ready(() => {
  const socket = io();

  $("#chatForm").submit(() => {
    const text = $('#chat-input').val();
    const userId = $('#chat-user-id').val();
    const userName = $('#chat-user-name').val();

    socket.emit("message", {
      content: text,
      userId,
      userName
    });
    $("#chat-input").val("");
    return false;
  });

  socket.on("message", message => {
    displayMessage(message);
  });

  const displayMessage = ({ user, userName, content }) => {
    $("#chat").prepend($("<li>").html(`
<strong class="message ${getCurrentUserClass(user)}">
${userName}
</strong>${content}
    `));
  };

  socket.on('load all messages', (messages) => {
    messages.forEach((message) => {
      displayMessage(message);
    });
  })

  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get("/api/courses?apiToken=recipeT0k3n", (results = {}) => {
      let data = results.data;
      if (!data || !data.courses) return;
      data.courses.forEach(course => {
        $(".modal-body").append(
          `<div>
						<span class="course-title">
							${course.title}
						</span>
						<button class='button ${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}">
							${course.joined ? "Joined" : "Join"}
						</button>
						<div class="course-description">
							${course.description}
						</div>
					</div>`
        );
      });
    }).then(() => {
      addJoinButtonListener();
    });
  });
});

let addJoinButtonListener = () => {
  $(".join-button").click(event => {
    let $button = $(event.target),
      courseId = $button.data("id");
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      if (data && data.success) {
        $button
          .text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        $button.text("Try again");
      }
    });
  });
};
