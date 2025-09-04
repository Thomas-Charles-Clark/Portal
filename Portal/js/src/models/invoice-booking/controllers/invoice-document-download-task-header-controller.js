function HeaderController() {
    var self = this;

    self.tasks = ko.observableArray([]); //Array<TaskProgressModel>

    self.cancelTask = function (task, e) {
        console.log('cancelling task...');
        task.cancelling(true);
        $.connection.documentDownloadHub.server.cancelTask(task.taskId());
        e.stopPropagation();
    }

    self.tasksNumber = ko.computed(function () {
        return self.tasks().length;
    }, self);

    $.connection.documentDownloadHub.client.progressChanged = function (taskList) {
        //console.log(taskList.flatMap(t => t.taskPercent));

        if (taskList.length == 0) {
            // self.tasks.removeAll();
        }
        else {
            // Removed
            var diff = self.tasks().filter(function (oldTask) {
                return taskList.every(function (newTask) {
                    return oldTask.taskId() !== newTask.taskId;
                });
            });

            //$.each(diff, function (index, task) {
            //    self.tasks.remove(task);
            //});

            // Added or Updated
            $.each(taskList, function (index, item) {
                var previousTask = self.tasks().find(t => t.taskId() === item.taskId);
                if (previousTask) {
                    previousTask.taskPercent(item.taskPercent);

                    let extantArchives = previousTask.createdArchiveFiles();

                    item.createdArchiveFiles.forEach(f => {
                        if (!extantArchives.find(ef => ef.FileName === f.FileName)) {
                            previousTask.createdArchiveFiles.push(f);
                        }
                    });

                    previousTask.createdArchiveFiles(item.createdArchiveFiles);
                }
                else {
                    self.tasks.push(new TaskProgressModel(item));
                }
            });

            //self.tasks(koArray);
        }
    };
}