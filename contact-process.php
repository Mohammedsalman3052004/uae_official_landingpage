<?php
session_start();

define("WEBMASTER_EMAIL", 'aqib@imsolutions.mobi');
define("WEBMASTER_EMAIL1", 'atul@imsolutions.mobi');
define("WEBMASTER_EMAIL2", 'imran@teknixelevators.com');
define("WEBMASTER_EMAIL3", 'jagruthi@teknixelevators.com');
//define("WEBMASTER_EMAIL4", 'parth@teknixelevators.com');
define("WEBMASTER_EMAIL5", 'sales.dxb@teknixelevators.com');


/*
define("WEBMASTER_EMAIL", 'ravi.k@imsolutions.mobi');
define("WEBMASTER_EMAIL1", 'lokesh@imsolutions.mobi');*/


error_reporting(E_ALL ^ E_NOTICE);
function ValidateEmail($value) {
    $regex = '/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i';
    if ($value == '') {
        return false;
    } else {
        $string = preg_replace($regex, '', $value);
    }
    return empty($string) ? true : false;
}
function validate_mobile($phone)
{
    return preg_match('/^[0-9]{10}+$/', $phone);
}
if ($_POST) {
    $name = stripslashes(trim($_POST['name']));
    $email = stripslashes(trim($_POST['email']));
    $ccode = trim(str_replace('+','',$_POST['ccode']));
    $states = stripslashes(trim($_POST['states']));
    $budget = stripslashes(trim($_POST['budget']));
    $buying_plan = stripslashes(trim($_POST['buying_plan']));
    $phone = stripslashes(trim($_POST['phone']));
    $query = stripslashes(trim($_POST['message']));
    $agreement = stripslashes(trim($_POST['marketingAgreement']));
   // $captcha = $_POST['g-recaptcha-response'];
    $subject = 'Enquiry from Teknix Elevators';
    $error = '';
// Check fullname
  if (!$name || empty($name)) {
        $error .= 'Please enter your Name.<br />';
        die('<p style="color:red;width:100%;">Please enter your Name</p>');
    }


    if (!$ccode) {
      //  $error .= 'Please Select your Country Code.<br />';
     //   die('<p style="color:red;width:100%;">Please Select your Country Code</p>');
    }
    if (!$phone || !validate_mobile($phone)) {
        $error .= 'Enter 10 digit mobile number.<br />';
        die('<p style="color:red;width:100%;">Enter 10 digit mobile number</p>');
    }
    if (!$phone || empty($phone)) {
        $error .= 'Please enter your phone.<br />';
        die('<p style="color:red;width:100%;">Please enter your phone</p>');
    }
    if (!$email || empty($email)) {
        $error .= 'Please enter an e-mail address.<br />';
        die('<p style="color:red;width:100%;">Please enter an e-mail address</p>');
    }
    if ($email && !ValidateEmail($email)) {
        $error .= 'Please enter a valid e-mail address.<br />';
        die('<p style="color:red;width:100%;">Please enter a valid e-mail address</p>');
    }

    if (!$states || empty($states)) {
        die('<p style="color:red;width:100%;">Please Select States.</p>');
    }

    if (!$budget || empty($budget)) {
        die('<p style="color:red;width:100%;">Please Select Budget.</p>');
    }

    if (!$buying_plan || empty($buying_plan)) {
        die('<p style="color:red;width:100%;">Please Select Buying Plan.</p>');
    }

    if (!$query || empty($query)) {
        $error .= 'Please enter your message.<br />';
        die('<p style="color:red;width:100%;">Please enter your message</p>');
    }
    if(strlen($query) != mb_strlen($query, 'utf-8')) {
        $error .= 'Please enter English words only.<br>';
        die('<p style="color:red;width:100%;margin:0px;">Please enter English words only</p>');
    }

    if(strpos($query , 'http://') !== false) {
        $error .= 'Invalid Message!.<br>';
        die('<p style="color:red;width:100%;margin:0px;">Invalid Message!</p>');
    }

    if(strpos($query , 'https://') !== false) {
        $error .= 'Invalid Message!.<br />';
        die('<p style="color:red;width:100%;margin:0px;">Invalid Message!</p>');
    }

    if(strlen($query)>200) {
        $error .= 'Characters limit 200 only!.<br />';
        die('<p style="color:red;width:100%;margin:0px;">Characters limit 200 only!</p>');
    }

    if(preg_match("/<[^<]+>/",$query,$m) == 1) {
        $error .= 'Invalid Message!.<br />';
        die('<p style="color:red;width:100%;margin:0px;">Invalid Message!</p>');
    }

    if (!isset($_POST['marketingAgreement'])) {
        die('<p style="color:red;width:100%;">Please agree to receive marketing emails and calls</p>');
    }


    $email_name = "Teknix Elevators";
    $email_to = "noreply@teknixelevators.com";
    $headers = 'MIME-Version: 2.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= 'From: ' . $email_name . ' <' . $email_to . '>' . "\r\n";
    $message = '<table cellspacing="0" cellpadding="0" style="width:100%; border:1px solid #ccc; font-size:14px;">

            <tr align="center" style="background-color:#f8f8f8;">
                <td colspan="2" style="padding:15px;">
                    <img src="https://teknixelevators.com/images/logo.png" alt="Company Logo" style="max-width: 150px;">
                </td>
            </tr>

            <tr style="background-color:#f5f5f5">
                <th style="vertical-align:top; color:#222; text-align:left; padding:15px; border-bottom:1px solid #eee;">Name <span style="color:red">*</span></th>
                <td style="vertical-align:top; color:#333; padding:15px; border-bottom:1px solid #eee;">' . $name . '</td>
            </tr>

            <tr style="">
                <th style="vertical-align:top; color:#222; text-align:left; padding:15px; border-bottom:1px solid #eee;">Email <span style="color:red">*</span></th>
                <td style="vertical-align:top; color:#333; padding:15px; border-bottom:1px solid #eee;">' . $email . '</td>
            </tr>

            <tr style="background-color:#f5f5f5">
                <th style="vertical-align:top; color:#222; text-align:left; padding:15px; border-bottom:1px solid #eee;">Phone Number <span style="color:red">*</span></th>
                <td style="vertical-align:top; color:#333; padding:15px; border-bottom:1px solid #eee;">' .$ccode.'  '. $phone . '</td>
            </tr>

            <tr style="">
                <th style="vertical-align:top; color:#222; text-align:left; padding:15px; border-bottom:1px solid #eee;">Emirates <span style="color:red">*</span></th>
                <td style="vertical-align:top; color:#333; padding:15px; border-bottom:1px solid #eee;">' . $states . '</td>
            </tr>

            <tr style="background-color:#f5f5f5">
                <th style="vertical-align:top; color:#222; text-align:left; padding:15px; border-bottom:1px solid #eee;">Budget <span style="color:red">*</span></th>
                <td style="vertical-align:top; color:#333; padding:15px; border-bottom:1px solid #eee;">' . $budget . '</td>
            </tr>

            <tr style="">
                <th style="vertical-align:top; color:#222; text-align:left; padding:15px; border-bottom:1px solid #eee;">Buying Plan <span style="color:red">*</span></th>
                <td style="vertical-align:top; color:#333; padding:15px; border-bottom:1px solid #eee;">' . $buying_plan . '</td>
            </tr>

            <tr style="background-color:#f5f5f5">
                <th style="vertical-align:top; color:#222; text-align:left; padding:15px; border-bottom:1px solid #eee;">Message <span style="color:red">*</span></th>
                <td style="vertical-align:top; color:#333; padding:15px; border-bottom:1px solid #eee;">' . $query . '</td>
            </tr>

            <tr style="">
                <th style="vertical-align:top; color:#222; text-align:left; padding:15px;">I agree to receive marketing emails and calls<span style="color:red">*</span></th>
                <td style="vertical-align:top; color:#333; padding:15px;">
                    <input type="checkbox" id="marketingAgreement" name="marketingAgreement" checked>
                    <label for="marketingAgreement">Yes, I agree</label>
                </td>
            </tr>

        </table>';

            //ini_set("sendmail_from", 'info@imsolutions.mobi'); // for windows server
            $mail =  mail(WEBMASTER_EMAIL,$subject,$message,$headers,'-freturn@teknixelevators.com');
            $mail1 = mail(WEBMASTER_EMAIL1,$subject,$message,$headers,'-freturn@teknixelevators.com');
            $mail2 = mail(WEBMASTER_EMAIL2,$subject,$message,$headers,'-freturn@teknixelevators.com');
            $mail3 = mail(WEBMASTER_EMAIL3,$subject,$message,$headers,'-freturn@teknixelevators.com');
           // $mail4 = mail(WEBMASTER_EMAIL4,$subject,$message,$headers,'-freturn@teknixelevators.com');
            $mail4 = mail(WEBMASTER_EMAIL5,$subject,$message,$headers,'-freturn@teknixelevators.com');

         // if($mail ||  $mail1 )
         if(true) {

           // echo 'OK';
           // die();
            date_default_timezone_set('Asia/Kolkata');


            include '../official_landingpage/google/vendor/autoload.php';

            $client = new Google_Client();

            $client->setApplicationName('google sheet');

            $client->setScopes([\Google_Service_Sheets::SPREADSHEETS]);

            $client->setAccessType('offline');

            $client->setAuthConfig('../official_landingpage/google/My Project 34423-e76a5ec1940f.json');

            $service = new Google_Service_Sheets($client);

            $spreadsheetId = "1GmNFXlZbwvOrqKtMzyBuRY4tdn61lF0wplKBAVRyRmo";


            $range = "A1:Z1";

            $values = [
                [ date('m-d-y'), $name,$ccode.''.$phone, $email, $query,'Teknix Elevators Landing Page', $states , $budget , $buying_plan , 'Yes, I agree'],
            ];

            $body = new Google_Service_Sheets_ValueRange([

                'values' => $values,

            ]);

            $params = [

                'valueInputOption' => 'RAW',

            ];

            $insert = [

                'insertDataOpton' => "INSERT_ROWS",

            ];

            $result = $service->spreadsheets_values->append($spreadsheetId, $range, $body, $params, $insert);

            echo 'OK';

            /////////////////////////////////google sheet code end here/////////////////////////
          }


}
?>