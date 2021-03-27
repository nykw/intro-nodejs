$(document).ready(() => {
  // クライアントサイドでioを初期化
  const socket = io();

  // フォームが送出されたときにイベントを発行
  $('#chatForm').submit(() => {
    socket.emit('message');
    $('#chat-input').val('');
    return false;
  });

  // サーバーから受信したメッセージをチャットボックスに表示
  const displayMessage = (message) => $('#chat').prepend($('<li>').html(message));

  // イベントを監視し、チャットボックスに記入
  socket.on('message', (message) => {
    displayMessage(message.content);
  });

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
