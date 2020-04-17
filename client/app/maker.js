const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoRanking").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax ("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
}

const deleteDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);

    if(e.target.value == ''){
        handleError("RAWR! Domo needs ID to be deleted!");
        return false;
    }

    // console.log($(e.target).attr("data"));

    const query = `id=${e.target.value}&_csrf=${$(e.target).attr("data")}`;

    // console.dir(query);

    sendAjax ("POST", "/deleter", query, function(){
        loadDomosFromServer();
    });

    return false;
};

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm">
                <label htmlFor="name">Name: </label>
                <input id="domoName" type="text" name="name" placeholder="Domo Name" />
                <label htmlFor="age">Age: </label>
                <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
                <label htmlFor="ranking">Ranking: </label>
                <input id="domoRanking" type="number" name="ranking" placeholder="Domo Ranking (Out of 10)" min="0" max="10" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet.</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3> 
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoRanking"> Ranking: {domo.ranking} </h3>
                <button type="button" data={props.csrf} value={domo._id} onClick={deleteDomo} > Delete Domo </button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax("GET", "/getDomos", null, (data) => {
        ReactDOM.render(
            <DomoList csrf={data.csrfToken} domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList csrf={csrf} domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setup(result.csrfToken);
    });
}

$(document).ready(function() {
    getToken();
});