// q3
// In `student.psv` there are some fake student datas from UNSW CSE (no doxx!). In each row, the fields from left to right are
//
// - ! UNSW Course Code
// - UNSW Student Number
// - Name
// - UNSW Program
// - UNSW Plan
// - ! WAM
// - UNSW Session
// - Birthdate
// - Sex
// 
// Write a Rust program to find the course which has the highest average student WAM.

use std::env;
use std::path::PathBuf;
use csv::ReaderBuilder;
use std::collections::HashMap;

fn main() {
    // Read current directory, which is one level below student.psv directory
    let mut cur_dir = env::current_dir().unwrap();
    cur_dir.pop();
    cur_dir.push("student.psv");
    
    // Create PSV reader for student.psv file
    let mut reader = ReaderBuilder::new()
        .has_headers(false)
        .delimiter(b'|')
        .from_path(PathBuf::from(cur_dir)).unwrap();

    // To calculate average, we need a sum of WAM and a count of course code occurrences.
    // 2 HashMaps will be used for this.
    let mut map_wam_sum: HashMap<String, f64> = HashMap::new();
    let mut map_course_occur: HashMap<String, f64> = HashMap::new();

    const RECORD_COURSE_CODE_IDX: usize = 0;
    const RECORD_WAM_IDX: usize = 5;

    // Iterate over records to store required values.
    for row in reader.records() {
        // Took an abnormally long time to understand: this iterator produces a slice, which is then dropped
        // on the next iteration!!! Thus, a type of &str cannot be used on course_code, and to_string() must
        // be called to convert it.
        let course_code = row.as_ref().unwrap().get(RECORD_COURSE_CODE_IDX).unwrap().to_string();
        let wam = row.as_ref().unwrap().get(RECORD_WAM_IDX).unwrap().parse::<f64>().unwrap();

        // course_code, since Copy is not implemented, will be moved when accessed.
        // A clone must be used so that the next call is not broken.
        let value = map_wam_sum.entry(course_code.clone()).or_insert(0.0);
        *value += wam;
        
        let value = map_course_occur.entry(course_code).or_insert(0.0);
        *value += 1.0;
    }

    // Ensure both HashMaps have the same length.
    assert_eq!(map_wam_sum.len(), map_course_occur.len());

    // Iterate over both HashMaps, calculating a running average.
    let mut highest_course_code = String::from("");
    let mut highest_average_wam = 0.0;
    for (course_code, wam_sum) in &map_wam_sum {
        let average_wam = *wam_sum / *map_course_occur.get(course_code).unwrap();

        if average_wam > highest_average_wam {
            highest_course_code = course_code.to_string();
            highest_average_wam = average_wam;
        }
    }

    println!("The course {} has the highest average WAM of {}.", highest_course_code, highest_average_wam);
}
