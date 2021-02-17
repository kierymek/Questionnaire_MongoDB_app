<?php
 
//require 'vendor/autoload.php' ;
 
class db {
    private $user = "8goral" ;
    private $pass = "pass8goral";
    private $host = "172.20.44.25";
    private $base = "8goral";
    private $coll = "questionnaire";
    private $collUsers = "users";
    private $conn;
    private $dbase;
    private $collection;
    private $coll_users;
 
 
 
    function __construct() {
      //$this->conn = new Mongo("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");
      $this->conn = new MongoDB\Client("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");    
      //$this->dbase = $this->conn->selectDB($this->base);
      //$this->collection = $this->dbase->selectCollection($this->coll);
      $this->collection = $this->conn->{$this->base}->{$this->coll};
      $this->coll_users = $this->conn->{$this->base}->{$this->collUsers};
    }
 
    function select() {
      $cursor = $this->coll_users->find();
      $table = iterator_to_array($cursor);
      return $table ;
    }

    function selectQuestionnaries() {
      $cursor = $this->collection->find();
      $table = iterator_to_array($cursor);
      return $table ;
    }
 
    function insert($user) {
      $ret = $this->collection->insertOne($user) ;
      return $ret;
    }

    function insert_user($user) {
      $cursor = $this->coll_users->find(array('login' => $user['login'], 'password' => $user['password']));
      $table = iterator_to_array($cursor);
      if(!$table) {
        $ret = $this->coll_users->insertOne($user) ;
        return $ret;
      } else {
        return null;
      }
    }

    function login($user) {
      $cursor = $this->coll_users->find(array('login' => $user['login'], 'password' => $user['password']));
      $table = iterator_to_array($cursor);
      if($table) { return array('login' => $user['login'], 'password' => $user['password']);}
      return $table ;
    }
 
    function update($ident,$user,$flag) {
      if ( $flag ) {
         $rec = new MongoDB\BSON\ObjectId($ident);
         $filter = array ( '_id' => $rec );
      } else {
         $filter = array ( 'ident' => $ident );
      }
      $update = array ( '$set' => $user );
      //$option = array ( 'w' => 1 );
      //$ret = $this->collection->update($filter,$update,$option);
      $updresult = $this->coll_users->updateOne($filter,$update);
      //return $ret['nModified'];
      $ret = $updresult->getModifiedCount();
      return $ret;
    }
 
    function delete($ident,$flag) {
      if ( $flag ) {
         $rec = new MongoDB\BSON\ObjectId($ident);
         $filter = array ( '_id' => $rec );
      } else {
         $filter = array ( 'ident' => $ident );
      }
      //$option = array( 'justOne' => true, 'w' => 1 );
      //$ret = $this->collection->remove($filter,$option);
      $delresult = $this->coll_users->deleteOne($filter);
      $ret = $delresult->getDeletedCount(); 
      //return $ret['n'];
      return $ret;
    }
}