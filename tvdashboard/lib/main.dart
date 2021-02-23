import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toast/toast.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return Shortcuts(
      shortcuts: {
        LogicalKeySet(LogicalKeyboardKey.select): ActivateIntent(),
      },
      child: MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: MyHomePage(title: 'Flutter Demo Home Page'),
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool openDashboard = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Zeal",
              style: TextStyle(fontSize: 80.0),
            ),
            SizedBox(
              height: 24,
            ),
            SizedBox(
              width: 200,
              // ignore: deprecated_member_use
              child: RaisedButton.icon(
                icon: Icon(Icons.open_in_browser),
                label: Text("Open Dashboard"),
                focusColor: Colors.blue[200],
                onPressed: () {
                  Toast.show("Dashboard is not implement!", context);
                },
              ),
            ),
            SizedBox(
              width: 200,
              // ignore: deprecated_member_use
              child: RaisedButton.icon(
                icon: Icon(Icons.info_outline),
                label: Text("Demo Mode"),
                focusColor: Colors.blue[200],
                onPressed: () {
                  Toast.show("Demo Mode", context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
