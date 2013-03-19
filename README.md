Asynchronous Flow for Enyo
==========================

This library implements asynchronous control flow for enyo. See the sample & api documentation for instructions.

Here is a hosted example of what can be done:

http://jdachtera.github.com/enyo-asyncflow/samples/sample.html

Kinds:
======

enyo.AsyncFlow
--------------

Combine several enyo.Asyncs or CommonJS style callbacks into one enyo.Async.
Can be executed consecutively or in parallel.

enyo.AsyncMap
-------------

Apply an enyo.Async or a CommonJS style callback to an array of items

enyo.ProgressingAsync
---------------------

Adds handlers for progress to enyo.Async

enyo.ProgressingAjax
--------------------

Adds handlers for download progress to enyo.Ajax

enyo.ImageLoader
----------------

Preloads an image via ajax or an img element

enyo.AsyncCallbackWrapper
-------------------------

Can be used to wrap a CommonJS style async function in an enyo.Async kind


