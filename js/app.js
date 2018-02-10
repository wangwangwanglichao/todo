'use strict';

(function (angular) {
	/* 主模块 */
	var app = angular.module('myTodo', []);
	/* 主控制器 */
	app.controller('mainController', ['$scope', '$location', function ($scope, $location) {
		/* 文本框*/
		$scope.text = '';
		/* 任务列表 */
		$scope.todos = [];
		/* 添加计划,给备忘录添加计划 */
		$scope.add = function () {
			/* 判断文本是否为空 */
			if (!$scope.text) {
				return;
			}
			$scope.todos.push({
				id: getId(),
				text: $scope.text, /* $scope.text为双向数据绑定,添加的同时可以拿到界面上的输入内容 */
				completed: false
			});
			/* 添加完成后清空输入框 */
			$scope.text = '';
		};
		/* 删除计划功能 */
		$scope.remove = function (id) {
			/* 遍历备忘录 */
			for (var i = 0; i < $scope.todos.length; i++) {
				/* 找到匹配的id */
				if ($scope.todos[i].id === id) {
					/* 删除对应索引值的计划 */
					$scope.todos.splice(i, 1);
					/* 结束循环 */
					break;
				}
			}
		};
		/* 清空已完成的计划 */
		$scope.clear = function () {
			/* 定义一个新数组 */
			var result = [];
			/* 遍历备忘录 */
			for (var i = 0; i < $scope.todos.length; i++) {
				/* 匹配未完成的计划 */
				if (!$scope.todos[i].completed) {
					/* 放到新数组中 */
					result.push($scope.todos[i]);
				}
			}
			/* 将新数组赋值给备忘录,备忘录的项只剩下未完成的计划 */
			$scope.todos = result;
		};
		/* 是否有已经完成的计划 */
		$scope.existCompleted = function () {
			/* 遍历备忘录 */
			for (var i = 0; i < $scope.todos.length; i++) {
				/* 匹配是否有已完成的计划 */
				if ($scope.todos[i].completed) {
					/* 如果有就直接返回true */
					return true;
				}
			}
			/* 遍历完都没有就返回false */
			return false;
		};
		/* 当前在编辑哪个计划 */
		$scope.currentEditingId = -1;
		/* 先假设一个不存在的id */
		$scope.editing = function (id) {
			$scope.currentEditingId = id;
			/* 双击谁就传谁的id进来,记录当前编辑的id */
		};
		/* 停止编辑 */
		$scope.save = function () {
			$scope.currentEditingId = -1;
			/* 将id重新设置为不存在的id */
		};
		/* 全选为已完成或未完成 */
		var now = true;
		$scope.toggleAll = function () {
			for (var i = 0; i < $scope.todos.length; i++) {
				$scope.todos[i].completed = now;
			}
			now = !now;
		};
		/* 状态筛选 */
		$scope.selector = {};
		/* 1.拿到锚点值; 2.根据锚点值对selector做出变化 */
		/* 因为,$scope.$watch只能监视$scope中的成员 */
		$scope.$location = $location;
		/* 所以,让$scope也有一个指向$location的成员,才能监视$location */
		$scope.$watch('$location.hash()', function (now, old) {

			/*var hash = $location.hash();
			 var url = $location.url();

			 console.log($location);
			 console.log(hash);
			 console.log(url);*/

			/* console.log(now); */

			switch (now) {
				case '/active':
					$scope.selector = {completed: false};
					break;
				case '/completed':
					$scope.selector = {completed: true};
					break;
				default:
					$scope.selector = {};
					break;
			}
		});

		/* 自定义比较函数 */
		$scope.equalCompare = function (source, target) {
			return source === target;
		};


		/* 获得随机数组成的无重复的id */
		function getId() {
			/* 将id设置为随机数 */
			var id = Math.random();
			/* 遍历备忘录 */
			for (var i = 0; i < $scope.todos.length; i++) {
				/* 如果有相同的id就重新获得随机数 */
				if ($scope.todos[i].id === id) {
					id = getId();
				}
			}
			/* 没有重复就返回id */
			return id;
		}
	}]);
})(angular);
