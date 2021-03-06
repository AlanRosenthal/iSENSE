<?php
/* Copyright (c) 2011, iSENSE Project. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials
 * provided with the distribution. Neither the name of the University of
 * Massachusetts Lowell nor the names of its contributors may be used to
 * endorse or promote products derived from this software without specific
 * prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 */


function isAdmin(){
  global $db; 
  
  $sql = "SELECT COUNT(*) FROM users,tokens 
          WHERE tokens.session_key = '{$_COOKIE['isense_login']}' 
          AND users.administrator=1 
          AND users.user_id = tokens.user_id";
  $output = $db->query($sql);
    
  return $output[0]['COUNT(*)']==1;

}

function isUser(){
    global $db;

    $sql = "SELECT COUNT(*) FROM tokens
            WHERE tokens.session_key = '{$_COOKIE['isense_login']}'";

    $output = $db->query($sql);

    return $output[0]['COUNT(*)']==1;
}

function isExperimentOwner($eid){
    global $db;

    $sql = "SELECT COUNT(*) FROM users,experiments,tokens
            WHERE tokens.session_key = '{$_COOKIE['isense_login']}'  
            AND users.user_id = experiments.owner_id
            AND users.user_id = tokens.user_id
            AND experiments.experiment_id = '{$eid}'";

    $output = $db->query($sql);

    return $output[0]['COUNT(*)']==1;
}

function isSessionOwner($sid){
    global $db;

    $sql = "SELECT COUNT(*) FROM users,sessions,tokens
            WHERE tokens.session_key = '{$_COOKIE['isense_login']}'  
            AND users.user_id = sessions.owner_id
            AND users.user_id = tokens.user_id
            AND sessions.session_id = '{$sid}'";

    $output = $db->query($sql);

    return $output[0]['COUNT(*)']==1;
}


function getTypeUnits() {
        global $db;
        
        $output = $db->query("  SELECT  types.name AS `type_name`,
                                                                        types.type_id,
                                                                        units.name AS `unit_name`,
                                                                        units.unit_id
                                                                        FROM type_units, types, units
                                                                        WHERE types.type_id = type_units.type_id
                                                                        AND units.unit_id = type_units.unit_id");
        
        if($db->numOfRows) {
                return $output;
        }
        
        return false;
}

function getTypes() {
        global $db;
        
        $output = $db->query("SELECT types.type_id, types.name FROM types ORDER BY types.name ASC");
        
        if($db->numOfRows) {
                return $output;
        }
        
        return false;
}

function getUnits() {
        global $db;
        
        $output = $db->query("SELECT units.unit_id, units.name FROM units ORDER BY units.name ASC");
        
        if($db->numOfRows) {
                return $output;
        }
        
        return false;
}

function getTypeIds($tid) {
        global $db;
        
        $output =  $db->query("SELECT   units.unit_id,
                                                                        units.name,
                                                                        units.abbreviation
                                                                        FROM units, type_units
                                                                        WHERE type_units.type_id = {$tid}
                                                                        AND units.unit_id = type_units.unit_id 
                                                                        ORDER BY units.name ASC");
        
        if($db->numOfRows) {
                return $output;
        }
        
        return false;   
}

function getActiveUsers() {
        global $db;
        
        $output = $db->query("SELECT    tokens.user_id, 
                                                                        users.firstname, 
                                                                        users.lastname, 
                                                                        tokens.updated FROM tokens 
                                                                        LEFT JOIN ( users ) ON ( users.user_id = tokens.user_id ) 
                                                                        WHERE tokens.updated + 1800 > NOW()");
        if($db->numOfRows) {
                return $output;
        }
        
        return false;
}

function safeString($string) {
        /**
         * This function has been deprecated in favor of using the input
         * replacment in sanitizer.php
         *
         * This should be removed once all references to it have been deleted.
         */
        /*if(get_magic_quotes_gpc()) {
                $string = stripslashes($string);
        }
        
        return str_replace("`", "\`", mysql_real_escape_string($string));*/
        return $string;
}

function contrib_cmp($a, $b) {
        if($a['contrib_count'] == $b['contrib_count']) {
                return 0;
        }
        
        return ($a['contrib_count'] < $b['contrib_count']);
}

function session_cmp($a, $b) {
        if($a['session_count'] == $b['session_count']) {
                return 0;
        }
        
        return ($a['session_count'] > $b['session_count']);
}

function date_cmp($a, $b) {
        
        if($a['timecreated'] == $b['timecreated']) {
                return 0;
        }
        
        return ($a['timecreated'] < $b['timecreated']);
}

function timeobj_cmp($a, $b) {

        if($a['timeobj'] == $b['timeobj']) {
                return 0;
        }
        
        return ($a['timeobj'] < $b['timeobj']);
}

function sort_relevancy($a, $b) {
        if($a['relevancy'] == $b['relevancy']) {
                return 0;
        }
        
        return ($a['relevancy'] < $b['relevancy']);
}

function getVersionNumber(){
    return exec('git describe --tags');
}

//Sort experiments by popularity
function exp_popularitySort($a,$b){
    return  $b["contrib_count"] - $a["contrib_count"];
}

//Sort experiments by activity
function exp_activitySort($a,$b){
    return  $b["session_count"] - $a["session_count"];
}

function dateDifference($day_1, $day_2) {
        $diff = $day_1 - $day_2;

        $sec   = $diff % 60;
        $diff  = intval($diff / 60);
        $min   = $diff % 60;
        $diff  = intval($diff / 60);
        $hours = $diff % 24;
        $days  = intval($diff / 24);
        
        $date_diff_string = "";
        if($days != 0) {
                $date_diff_string .= $days . " days ";
        }
        
        if($hours != 0) {
                $date_diff_string .= $hours . " hours ";
        }
        
        if($min != 0) {
                $date_diff_string .= $min . " minutes ";
        }
        
        $date_diff_string .= "ago";

        return $date_diff_string;
}

function getJSONFromFile($filename){
    
    //Open the file.
    $file = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    $file_data = array();
    $header = array();
    
    $json = array('headers'=>array(), 'data'=>array());
    
    // Need to do attempt to match up fields
    foreach($file as $f) {
        if(strpos($f, "#") !== false) {
            $debug_data .= $f . " ";
        }
        else {
            array_push($file_data, explode(",", $f));
        }
    }
    
    // Grab the header
    $header = $file_data[0];
    $first_header = $header[0];
    $first_data = $file_data[1];             
    
    // Clean header
    for($i = 0; $i < count($header); $i++) {
            $header[$i] = strtolower(str_replace("\"", "", $header[$i]));
    }
    
    $preformatted = array_slice($file_data,1,count($file_data)-1);
    
    //Transpose the array
    $row_count = count($preformatted[0]);
    $transposed = array();
    
    //Init the new array
    for($i=0;$i<$row_count;$i++){
        $transposed=array();
    }
    
    //Transpose the array
    foreach ($preformatted as $line) {
        for($i=0;$i<$row_count;$i++){         
            $transposed[$i][] = $line[$i];
        }
    }
    
    $json['data'] = $transposed;
    $json['headers'] = $header;
    
    return $json;
}

function getColumnMatches($data_pre_match,$eid){
    $fields = array();
    
    $file_headers = $data_pre_match['headers'];
    
    foreach (getFields($eid) as $field){
        $fields[] = strtolower($field['field_name']);
    }

    $matched_columns = array();
    for($i=0;$i<count($fields);$i++){
        $matched_columns[$i]=-1;
    }
    
    //THE BAYES NET IMPLEMENTATION SHOULD GO HERE
    for($j=0; $j<count($fields); $j++){
        for($i=0; $i<count($file_headers); $i++){
            $field = preg_replace( '/\s+/', '', $fields[$j]);
            $file_header = preg_replace( '/\s+/', '', $file_headers[$i]);
            if(strcmp($field,$file_header)==0){
                $matched_columns[$j] = $i;
            }
        }
    }
    
    //Count number of mismatched 
    $mismatched_count = 0;
    foreach ($matched_columns as $column) {
        if($column == -1){
            $mismatched_count++;
        }   
    }
    
    $matches = array ('matches'=>$matched_columns, 'mismatched_count'=>$mismatched_count);
    
    return $matches;
}

function shuffleColumns($filename,$eid,$hand_matched=null){
    
    //Recompute everything cause page state is a pain.
    $json = getJSONFromFile($filename);
    $matches = getColumnMatches($json,$eid);
    
    //Fill in the missing headers from matched.
    if($hand_matched != null){
        for ($i=0; $i < count($matches['matches']); $i++){
            foreach($hand_matched as $match){
                if($match['field']==$i){ 
                    $matches['matches'][$i] = $match['header'];
                }
            } 
        }
    }
    
    //Init the new data array
    $data_pre = $json['data'];
    $data = array();
    $numrows = count($data_pre[0]);
    
    //return $matches['matches'];
    
    //$matchlist = $matches['matches'];
    
    for($i=0; $i < $numrows; $i++){
        $data[$i] = array();
    }
    
    //Transpose the array back to rows from columns
    for($i=0; $i < $numrows; $i++){
        foreach($matches['matches'] as $key=>$match){
            $data[$i][$key] = $data_pre[$match][$i];
        }
    }
    
    return $data;
    
}


function fixTime($data, $eid){
    
        //Check for time Fields
        $timefields = array();
        foreach(getFields($eid) as $key=>$field){
            if($field['type_id']==7){
                $timefields[]=$key;
            }
        }
        
        //If there are time fields check them else return data.
        if(count($timefields) > 0){
            foreach($data as $row_key=>$row){
                foreach($timefields as $tfield){
                    $preformatted = $data[$row_key][$tfield];
                    $fixed_time; 
                    
                    //Do time fix on each timefield
                    if( is_numeric($preformatted) ) {
                        //leave it alone
                        $fixed_time = $preformatted;
                    } else {
                        if( $loc = strpos($preformatted, '.') ) {
                            $fixed_time = (strtotime(substr($preformatted, 0, $loc))*1000) + (intval(substr($preformatted, $loc+1)) * 1000);
                        } else {
                            $tmp = explode(':', $preformatted);
                            
                            if( count($tmp) == 3 ) {
                                $fixed_time = strtotime($tmp[0].$tmp[1])*1000;
                                $fixed_time = $fixed_time + ($tmp[2]*1000);
                            } else {
                                $tmp = strtotime($preformatted);
                                //Store $tmp * 1000
                                $fixed_time = $tmp * 1000;      
                            }
                        }
                        
                    } 
                    
                    $data[$row_key][$tfield] = $fixed_time;
                }
            }
        } 
        
        return $data;
}

?>
