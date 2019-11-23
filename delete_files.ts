// Requiring path and fs modules
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const rimraf = require("rimraf");

function get_created_date(my_path: string) {
  // Generate files and child folders lay in the my_path folder. EG: [ 'file 1.txt', 'New folder 1', 'New folder 2' ]
  let file_list: [string][] = fs.readdirSync(my_path);
  /* Extend full path of each files/child folders in the my_path folder. EG: 
  [
  'c:\\Users\\giang\\Documents\\Test Folder\\file 1.txt',
  'c:\\Users\\giang\\Documents\\Test Folder\\New folder 1',
  'c:\\Users\\giang\\Documents\\Test Folder\\New folder 2'
  ]
  */
  let path_list: [string][] = file_list.map(function(each_filename) {
    return path.join(my_path, each_filename);
  });
  /* Return a list in which contain {file path, ctime} objects. EG:
  [
  {
    path: 'c:\\Users\\giang\\Documents\\Test Folder\\file 1.txt',
    ctime: 2019-11-23T12:59:23.176Z
  },
  {
    path: 'c:\\Users\\giang\\Documents\\Test Folder\\New folder 1',
    ctime: 2019-11-23T12:59:30.430Z
  },
  {
    path: 'c:\\Users\\giang\\Documents\\Test Folder\\New folder 2',
    ctime: 2019-11-23T12:59:14.922Z
  }
  ] 
  */
  let file_stat_list = path_list.map(function(each_filepath) {
    let each_stat = fs.statSync(each_filepath);
    return {
      path: each_filepath,
      ctime: each_stat.ctime
    };
  });
  return file_stat_list;
}

function custom_remove(my_path: string, days_from_now: number): void {
  // Create  list in which contain {file path, ctime} objects. See get_create_date function.
  let file_stat_list = get_created_date(my_path);
  // Filter the above file list from which create time > defined time
  let delete_list = file_stat_list.filter(function(each_file_stat_object) {
    let created_time = moment(each_file_stat_object.ctime);
    let now = moment();
    // Calculate the different time between file created time and now.
    let time_diff = now.diff(created_time, "days");
    return time_diff > days_from_now;
  });
  let delete_list_count = delete_list.length; // Count the items in delete list (filtered)
  if (delete_list_count != 0) {
    console.log(`These ${delete_list_count} item(s) will be deleted:`);
    console.log(delete_list);
    let confirm = "Y"; // Placeholder for get user's input function
    if (confirm.toUpperCase() == "Y") {
      console.log("Deleting...");
      delete_list.forEach(function(each_file_stat_object) {
        rimraf.sync(each_file_stat_object.path);
      });
      console.log("Done!");
    } else {
      console.log("No action has been taken!");
    }
  } else {
    console.log("No item matched the condition!");
  }
}

//custom_remove(my_path, 0);
