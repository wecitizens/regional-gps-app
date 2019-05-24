<template>
    <div class="results">
        <h3 class="mb-3 d-print-none">{{ $t("button.see_results") }} :</h3>
        <el-collapse v-model="activeTabs">
            <el-collapse-item :title="$t('choose.regional_elections')" name="region">
                <b-card no-body>
                    <b-tabs card>
                        <b-tab :title="$t('title.candidates')" class="col-md-6 tab-center" active>
                            <p class="list-legend">{{ $t('Les candidats qui partagent le plus mes convictions sont')
                                }}:</p>
                            <div class="row list-item"
                                 v-for="(item, idx) in currentRegCandidateScores.map(extractRegCandidate)"
                                 :key="idx" v-bind:class="{ disabled: !item.has_answered }" v-if="item.score && item.has_answered">
                                <div class="col-3 d-print-none">
                                    <div class="image"><img :src="item.img" v-if="item.img"
                                                            class="img-thumbnail"/>
                                        <img
                                                src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png"
                                                v-else
                                                class="img-thumbnail"/></div>
                                </div>
                                <div class="col-9">
                                    <div class="title">
                                        <a v-if="item.completeness > 12"
                                           :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.id"
                                           target="_blank">{{ item.name }}</a>
                                        <span v-else>{{ item.name }}</span>
                                    </div>
                                    <div class="subtitle"><span v-if="item.position > 0">#{{ item.position }}</span> {{
                                        item.group }}
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                             :style="'width:' + item.score + '%;'"
                                             :aria-valuenow="item.score"
                                             aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>


                        <b-tab :title="$t('title.substitutes')" class="col-md-6 tab-center" active>
                            <p class="list-legend">{{ $t('Les suppléants qui partagent le plus mes convictions sont')
                                }}:</p>
                            <div class="row list-item"
                                 v-for="(item, idx) in currentRegSubstituteScores.map(extractRegSubstitute)"
                                 :key="idx" v-bind:class="{ disabled: !item.has_answered }"  v-if="item.score && item.has_answered">
                                <div class="col-3 d-print-none">
                                    <div class="image"><img :src="item.img" v-if="item.img"
                                                            class="img-thumbnail"/>
                                        <img
                                                src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png"
                                                v-else
                                                class="img-thumbnail"/></div>
                                </div>
                                <div class="col-9">
                                    <div class="title">
                                        <a v-if="item.completeness > 12"
                                           :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.id"
                                           target="_blank">{{ item.name }}</a>
                                        <span v-else>{{ item.name }}</span>
                                    </div>
                                    <div class="subtitle"><span v-if="item.position > 0">#{{ item.position }}</span> {{
                                        item.group }}
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                             :style="'width:' + item.score + '%;'"
                                             :aria-valuenow="item.score"
                                             aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                        <b-tab :title="$t('title.parties')" class="col-md-6 tab-center" active>
                            <p class="list-legend">{{ $t('Les listes qui partagent le plus mes convictions sont')
                                }}:</p>
                            <div class="row list-item"
                                 v-for="(item, idx) in currentRegElectoralListScores.map(extractRegDistrictList)"
                                 :key="idx" v-bind:class="{ disabled: !item.has_answered }" v-if="item.score  && item.has_answered ">
                                <div class="col-3 d-print-none">
<!--                                    <div class="image"><img :src="item.img" v-if="item.img"-->
<!--                                                            class="img-thumbnail"/>-->
<!--                                        <img-->
<!--                                                src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png"-->
<!--                                                v-else-->
<!--                                                class="img-thumbnail"/></div>-->
                                </div>
                                <div class="col-9">
                                    <div class="title">
                                        <a v-if="item.completeness > 12"
                                           :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.id"
                                           target="_blank">{{ item.name }}</a>
                                        <span v-else>{{ item.name }}</span>
                                    </div>
                                    <div class="subtitle"><span v-if="item.position > 0">#{{ item.position }}</span> {{
                                        item.group }}
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                             :style="'width:' + item.score + '%;'"
                                             :aria-valuenow="item.score"
                                             aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                    </b-tabs>
                </b-card>
            </el-collapse-item>
            <el-collapse-item :title='$t("choose.federal_elections")' name="federal">
                <b-card>
                    <b-tabs card>

                        <b-tab :title="$t('title.candidates')" class="col-md-6 tab-center" active>
                            <p class="list-legend">{{ $t('Les candidats qui partagent le plus mes convictions sont')
                                }}:</p>
                            <div class="row list-item"
                                 v-for="(item, idx) in currentFedCandidateScores.map(extractFedCandidate)"
                                 :key="idx" v-bind:class="{ disabled: !item.has_answered }"   v-if="item.score && item.has_answered">
                                <div class="col-3">
                                    <div class="image"><img :src="item.img" v-if="item.img"
                                                            class="img-thumbnail"/>
                                        <img
                                                src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png"
                                                v-else
                                                class="img-thumbnail"/></div>
                                </div>
                                <div class="col-9">
                                    <div class="title">
                                        <a v-if="item.completeness > 12"
                                           :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.id"
                                           target="_blank">{{ item.name }}</a>
                                        <span v-else>{{ item.name }}</span>
                                    </div>
                                    <div class="subtitle"><span v-if="item.position > 0">#{{ item.position }}</span> {{
                                        item.group }}
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                             :style="'width:' + item.score + '%;'"
                                             :aria-valuenow="item.score"
                                             aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                        <b-tab :title="$t('title.substitutes')" class="col-md-6 tab-center" active>
                            <p class="list-legend">{{ $t('Les suppléants qui partagent le plus mes convictions sont')
                                }}:</p>
                            <div class="row list-item"
                                 v-for="(item, idx) in currentFedSubstituteScores.map(extractFedSubstitute)"
                                 :key="idx" v-bind:class="{ disabled: !item.has_answered }"  v-if="item.score && item.has_answered">
                                <div class="col-3">
                                    <div class="image"><img :src="item.img" v-if="item.img"
                                                            class="img-thumbnail"/>
                                        <img
                                                src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png"
                                                v-else
                                                class="img-thumbnail"/></div>
                                </div>
                                <div class="col-9">
                                    <div class="title">
                                        <a v-if="item.completeness > 12"
                                           :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.id"
                                           target="_blank">{{ item.name }}</a>
                                        <span v-else>{{ item.name }}</span>
                                    </div>
                                    <div class="subtitle"><span v-if="item.position > 0">#{{ item.position }}</span> {{
                                        item.group }}
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                             :style="'width:' + item.score + '%;'"
                                             :aria-valuenow="item.score"
                                             aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                        <b-tab :title="$t('title.parties')" class="col-md-6 tab-center" active>
                            <p class="list-legend">{{ $t('Les listes qui partagent le plus mes convictions sont')
                                }}:</p>
                            <div class="row list-item"
                                 v-for="(item, idx) in currentFedElectoralListScores.map(extractFedDistrictList)"
                                 :key="idx" v-bind:class="{ disabled: !item.has_answered }" v-if="item.score  && item.has_answered ">
                                <div class="col-3">
<!--                                    <div class="image"><img :src="item.img" v-if="item.img"-->
<!--                                                            class="img-thumbnail"/>-->
<!--                                        <img-->
<!--                                                src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png"-->
<!--                                                v-else-->
<!--                                                class="img-thumbnail"/></div>-->
                                </div>
                                <div class="col-9">
                                    <div class="title">
                                        <a v-if="item.completeness > 12"
                                           :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.id"
                                           target="_blank">{{ item.name }}</a>
                                        <span v-else>{{ item.name }}</span>
                                    </div>
                                    <div class="subtitle"><span v-if="item.position > 0">#{{ item.position }}</span> {{
                                        item.group }}
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                             :style="'width:' + item.score + '%;'"
                                             :aria-valuenow="item.score"
                                             aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </el-collapse-item>
            <el-collapse-item :title='$t("choose.european_elections")' name="european">
                <b-card>
                    <b-tabs card>
                        <b-tab :title="$t('title.candidates')" class="col-md-6 tab-center" active>
                            <p class="list-legend">{{ $t('Les candidats qui partagent le plus mes convictions sont')
                                }}:</p>
                            <div class="row list-item"
                                 v-for="(item, idx) in currentEurCandidateScores.map(extractEurCandidate)"
                                 :key="idx" v-bind:class="{ disabled: !item.has_answered }"  v-if="item.score && item.has_answered">
                                <div class="col-3 d-print-none">
                                    <div class="image"><img :src="item.img" v-if="item.img"
                                                            class="img-thumbnail"/>
                                        <img
                                                src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png"
                                                v-else
                                                class="img-thumbnail"/></div>
                                </div>
                                <div class="col-9">
                                    <div class="title">
                                        <a v-if="item.completeness > 12"
                                           :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.id"
                                           target="_blank">{{ item.name }}</a>
                                        <span v-else>{{ item.name }}</span>
                                    </div>
                                    <div class="subtitle"><span v-if="item.position > 0">#{{ item.position }}</span> {{
                                        item.group }}
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                             :style="'width:' + item.score + '%;'"
                                             :aria-valuenow="item.score"
                                             aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                        <b-tab :title="$t('title.substitutes')" class="col-md-6 tab-center" active>
                            <p class="list-legend">{{ $t('Les suppléants qui partagent le plus mes convictions sont')
                                }}:</p>
                            <div class="row list-item"
                                 v-for="(item, idx) in currentEurSubstituteScores.map(extractEurSubstitute)"
                                 :key="idx" v-bind:class="{ disabled: !item.has_answered }"  v-if="item.score && item.has_answered">
                                <div class="col-3 d-print-none">
                                    <div class="image"><img :src="item.img" v-if="item.img"
                                                            class="img-thumbnail"/>
                                        <img
                                                src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png"
                                                v-else
                                                class="img-thumbnail"/></div>
                                </div>
                                <div class="col-9">
                                    <div class="title">
                                        <a v-if="item.completeness > 12"
                                           :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.id"
                                           target="_blank">{{ item.name }}</a>
                                        <span v-else>{{ item.name }}</span>
                                    </div>
                                    <div class="subtitle"><span v-if="item.position > 0">#{{ item.position }}</span> {{
                                        item.group }}
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                             :style="'width:' + item.score + '%;'"
                                             :aria-valuenow="item.score"
                                             aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                        <b-tab :title="$t('title.parties')" class="col-md-6 tab-center" active>
                            <p class="list-legend">{{ $t('Les listes qui partagent le plus mes convictions sont')
                                }}:</p>
                            <div class="row list-item"
                                 v-for="(item, idx) in currentEurElectoralListScores.map(extractEurDistrictList)"
                                 :key="idx" v-bind:class="{ disabled: !item.has_answered }"  v-if="item.score  && item.has_answered">
                                <div class="col-3">
<!--                                    <div class="image"><img :src="item.img" v-if="item.img"-->
<!--                                                            class="img-thumbnail"/>-->
<!--                                        <img-->
<!--                                                src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png"-->
<!--                                                v-else-->
<!--                                                class="img-thumbnail"/></div>-->
                                </div>
                                <div class="col-9">
                                    <div class="title">
                                        <a v-if="item.completeness > 12"
                                           :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.id"
                                           target="_blank">{{ item.name }}</a>
                                        <span v-else>{{ item.name }}</span>
                                    </div>
                                    <div class="subtitle"><span v-if="item.position > 0">#{{ item.position }}</span> {{
                                        item.group }}
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                             :style="'width:' + item.score + '%;'"
                                             :aria-valuenow="item.score"
                                             aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>


                    </b-tabs>
                </b-card>
            </el-collapse-item>
        </el-collapse>
        <button @click="printDiv" class="btn btn-block btn-secondary mt-3 d-print-none">{{ $t("print")}}</button>
        <button @click="donate" class="btn btn-block btn-secondary mt-3 d-print-none">{{ $t("menu.item.donate")}}</button>
        <button @click="share" class="btn btn-block btn-secondary mt-3 d-print-none">{{$t('menu.item.share_app',
            {'app_title' :
            $t('app.title')}) }}
        </button>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'results',
        methods: {
            printDiv() {

                this.activeTabs = [
                    "region",
                    "federal",
                    "european"
                ];
                setTimeout(() => {
                    window.print();
                }, 2000); // Fix to print after scroll animation
            },
            donate() {
                this.$store.dispatch('showDonate');
            },
            share() {
                window.$('#share-modal').modal('show');
            },
            getElectoralListForScore(score) {
                return this.currentElection.electoral_lists.find(e => e.key == score.user_key);
            },

            extractRegCandidate(score) {
                console.log('extractRegCandidate >  user_key: ' + score.user_key);
                // console.log('**** extractRegCandidate:**** ');
                // console.log('score',  score);
                //console.log('regDistrictLists:');console.log(this.regDistrictLists);
                //console.log('regCandidates:'); console.log(this.regCandidates);
                //let group = this.currentElection.electoral_lists
                //console.log('group'); console.log(group);
                //console.log('regCandidates.length: ', this.regCandidates.length);
                //for (let idx = 0; idx < this.regCandidates.length; idx++) {
                //console.log(this.regCandidates[idx].key);
                //}
                if (!this.regCandidates) return {};

                let group, groupName = '', listPosition = '';
                if (this.regDistrictLists) {
                    group = this.regDistrictLists.filter(e => e.candidates.map(c => c.key).includes(score.user_key))[0];
                    if (group) {
                        groupName = group.full_name;
                        listPosition = group.candidates.find(c => c.key == score.user_key).order
                    }
                }

                let candidate = this.regCandidates.find(p => p.key == score.user_key);

                if (candidate) {
                    console.log('Reg candidate:' + candidate.politician_id + ' ' + candidate.full_name + ' : ' + score.score);
                    return {
                        id: candidate.politician_id, name: candidate.full_name,
                        group: groupName, position: listPosition,
                        score: score.score, img: candidate.img,
                        has_answered: candidate.has_answered, completeness: candidate.completeness
                    }
                } else {
                    console.log('Reg candidate ' + score.user_key + ' not found');
                    return {}
                }
            },

            extractRegSubstitute(score) {
                console.log('extractRegSubstitute >  user_key: ' + score.user_key);
                if (!this.regSubstitutes) return {};
                let group, groupName = '', listPosition = '';
                if (this.regDistrictLists) {
                    group = this.regDistrictLists.filter(e => e.candidates.map(c => c.key).includes(score.user_key))[0];
                    if (group) {
                        groupName = group.full_name;
                        listPosition = group.candidates.find(c => c.key == score.user_key).order
                    }
                }
                let candidate = this.regSubstitutes.find(p => p.key == score.user_key);
                if (candidate) {
                    console.log('Reg substitute:' + candidate.politician_id + ' ' + candidate.full_name + ' : ' + score.score);
                    return {
                        id: candidate.politician_id, name: candidate.full_name,
                        group: groupName, position: listPosition,
                        score: score.score, img: candidate.img,
                        has_answered: candidate.has_answered, completeness: candidate.completeness
                    }
                } else {
                    console.log('Reg substitute ' + score.user_key + ' not found');
                    return {}
                }
            },

            extractRegDistrictList(score) {
                console.log('extractRegParty >  user_key: ' + score.user_key);

                if (!this.regDistrictLists) return {}
                let candidate = this.regDistrictLists.find(p => p.key == score.user_key);

                console.log('Reg party:');
                console.log(candidate);
                if (candidate) {
                    console.log(candidate.politician_id + ' ' + candidate.full_name + ' : ' + score.score);
                    return {
                        id: candidate.politician_id, name: candidate.full_name,
                        group: '', position: 0, score: score.score, img: candidate.img,
                        has_answered: candidate.has_answered, completeness: candidate.completeness
                    }
                } else {
                    console.log('party ' + score.user_key + ' not found');
                    return {}
                }
            },

            // Yet another ugly copy-paste-adapt . Promis, la semaine prochaine je commence à apprendre Vuex.-
            extractFedCandidate(score) {
                console.log('extractFedCandidate >  user_key: ' + score.user_key);
                if (!this.fedCandidates) return {}
                let group, groupName = '', listPosition = '';
                if (this.fedDistrictLists) {
                    group = this.fedDistrictLists.filter(e => e.candidates.map(c => c.key).includes(score.user_key))[0];
                    if (group) {
                        groupName = group.full_name;
                        listPosition = group.candidates.find(c => c.key == score.user_key).order
                    }
                }
                let candidate = this.fedCandidates.find(p => p.key == score.user_key);

                console.log('Fed candidate');
                console.log(candidate);
                if (candidate) {
                    console.log(candidate.politician_id + ' ' + candidate.full_name + ' : ' + score.score);
                    return {
                        id: candidate.politician_id, name: candidate.full_name,
                        group: groupName, position: listPosition, score: score.score, img: candidate.img,
                        has_answered: candidate.has_answered, completeness: candidate.completeness
                    }
                } else {
                    console.log('candidate ' + score.user_key + ' not found');
                    return {}
                }
            },


            extractFedSubstitute(score) {
                console.log('extractFedSubstitute >  user_key: ' + score.user_key);
                if (!this.fedSubstitutes) return {}
                let group, groupName = '', listPosition = '';
                if (this.fedDistrictLists) {
                    group = this.fedDistrictLists.filter(e => e.candidates.map(c => c.key).includes(score.user_key))[0];
                    if (group) {
                        groupName = group.full_name;
                        listPosition = group.candidates.find(c => c.key == score.user_key).order
                    }
                }
                let candidate = this.fedSubstitutes.find(p => p.key == score.user_key);
                console.log('Fed substitute:');
                console.log(candidate);
                if (candidate) {
                    console.log(candidate.politician_id + ' ' + candidate.full_name + ' : ' + score.score);
                    return {
                        id: candidate.politician_id, name: candidate.full_name,
                        group: groupName, position: listPosition,
                        score: score.score, img: candidate.img,
                        has_answered: candidate.has_answered, completeness: candidate.completeness
                    }
                } else {
                    console.log('candidate ' + score.user_key + ' not found');
                    return {}
                }
            },

            // Yet another ugly copy paste....
            extractFedDistrictList(score) {
                console.log('extractFedParty >  user_key: ' + score.user_key);
                if (!this.fedDistrictLists) return {}
                let candidate = this.fedDistrictLists.find(p => p.key == score.user_key);

                console.log('Fed party');
                console.log(candidate);
                if (candidate) {
                    console.log(candidate.politician_id + ' ' + candidate.full_name + ' : ' + score.score);
                    return {
                        id: candidate.politician_id, name: candidate.full_name,
                        group: '', position: 0, score: score.score, img: candidate.img,
                        has_answered: candidate.has_answered, completeness: candidate.completeness
                    }
                } else {
                    console.log('party ' + score.user_key + ' not found');
                    return {}
                }
            },


            extractEurCandidate(score) {
                console.log('extractEurCandidate >  user_key: ' + score.user_key);
                if (!this.eurCandidates) return {}
                let candidate = this.eurCandidates.find(p => p.key == score.user_key);
                let group, groupName = '', listPosition = '';
                if (this.eurDistrictLists) {
                    group = this.eurDistrictLists.filter(e => e.candidates.map(c => c.key).includes(score.user_key))[0];
                    if (group) {
                        groupName = group.full_name;
                        listPosition = group.candidates.find(c => c.key == score.user_key).order
                    }
                }

                console.log('Eur candidate');
                console.log(candidate);
                if (candidate) {
                    console.log(candidate.politician_id + ' ' + candidate.full_name + ' : ' + score.score);
                    return {
                        id: candidate.politician_id, name: candidate.full_name,
                        group: groupName, position: listPosition, score: score.score, img: candidate.img,
                        has_answered: candidate.has_answered, completeness: candidate.completeness
                    }
                } else {
                    console.log('candidate ' + score.user_key + ' not found');
                    return {}
                }
            },


            extractEurSubstitute(score) {
                console.log('extractEurSubstitute >  user_key: ' + score.user_key);
                if (!this.eurSubstitutes) return {}
                let group, groupName = '', listPosition = '';
                if (this.regDistrictLists) {
                    group = this.regDistrictLists.filter(e => e.candidates.map(c => c.key).includes(score.user_key))[0];
                    if (group) {
                        groupName = group.full_name;
                        listPosition = group.candidates.find(c => c.key == score.user_key).order
                    }
                }
                let candidate = this.eurSubstitutes.find(p => p.key == score.user_key);
                console.log('Eur substitute:');
                console.log(candidate);
                if (candidate) {
                    console.log(candidate.politician_id + ' ' + candidate.full_name + ' : ' + score.score);
                    return {
                        id: candidate.politician_id, name: candidate.full_name,
                        group: groupName, position: listPosition, score: score.score, img: candidate.img,
                        has_answered: candidate.has_answered, completeness: candidate.completeness
                    }
                } else {
                    console.log('candidate ' + score.user_key + ' not found');
                    return {}
                }
            },

            // Yet another ugly copy paste....
            extractEurDistrictList(score) {
                console.log('extractEurParty >  user_key: ' + score.user_key);
                if (!this.eurDistrictLists) return {}
                let candidate = this.eurDistrictLists.find(p => p.key == score.user_key);

                console.log('Eur party:');
                console.log(candidate);
                if (candidate) {
                    console.log(candidate.politician_id + ' ' + candidate.full_name + ' : ' + score.score);
                    return {
                        id: candidate.politician_id, name: candidate.full_name,
                        group: '', position: 0, score: score.score, img: candidate.img,
                        has_answered: candidate.has_answered, completeness: candidate.completeness
                    }
                } else {
                    console.log('party ' + score.user_key + ' not found');
                    return {}
                }
            },

            extractCandidate(score) {
                console.log('**** extractCandidate**** ');
                let group = this.currentElection.electoral_lists
                    .filter(e => e.candidates.map(c => c.key).includes(score.user_key))[0]
                let candidate = this.currentElection.candidates.find(p => p.key == score.user_key)
                console.log(score)
                if (candidate) {
                    return {
                        id: candidate.politician_id,
                        name: candidate.full_name,
                        group: this.$t('vote.' + group.name),
                        position: group.candidates.find(c => c.key == score.user_key).order,
                        score: score.score,
                        img: candidate.img,
                        has_answered: candidate.has_answered,
                        completeness: candidate.completeness
                    }
                } else {
                    return {}
                }
            },


            extractList(score) {
                console.log('**** extractList*** ');

                let list = this.getElectoralListForScore(score)
                if (list) {
                    return {
                        name: this.$t('vote.' + list.name),
                        score: score.score,
                        img: list.img
                    }
                } else {
                    return {}
                }
            }
        },
        created() {

            console.log('Store', this.$store);

            const poll = this.$store.state.survey.current.poll;
            const currVote = this.$store.state.vote.current;
            var segment_keys = [];

            if (currVote) {

                console.log('currVote:');
                console.log(currVote);

                if (currVote.regDistrict) {
                    let reg_base_segment = '2019_be_reg_' + currVote.regDistrict.code;
                    segment_keys.push(reg_base_segment + '_candidate');
                    segment_keys.push(reg_base_segment + '_substitute');
                    segment_keys.push(reg_base_segment + '_electoral_list');
                    //segment_keys.push( reg_base_segment+ '_candidate', reg_base_segment+ '_substitute');
                    //segment_keys.push( reg_base_segment+ '_candidate' , reg_base_segment+ '_substitute', reg_base_segment+ '_electoral_list' );
                } else {
                    console.log('currVote.regDistrict EMPTY');
                }

                if (currVote.fedDistrict) {
                    let fed_base_segment = '2019_be_fed_' + currVote.fedDistrict.code;
                    //segment_keys.push( fed_base_segment+ '_candidate');
                    //segment_keys.push( fed_base_segment+ '_substitute');
                    segment_keys.push(fed_base_segment + '_candidate', fed_base_segment + '_substitute', fed_base_segment + '_electoral_list');
                } else {
                    console.log('currVote.fedDistrict EMPTY');
                }

                if (currVote.eurDistrict) {
                    let eur_base_segment = '2019_be_eur_' + currVote.eurDistrict.code;
                    //segment_keys.push( eur_base_segment+ '_candidate');
                    //segment_keys.push( eur_base_segment+ '_substitute');
                    segment_keys.push(eur_base_segment + '_candidate', eur_base_segment + '_substitute', eur_base_segment + '_electoral_list');
                } else {
                    console.log('currVote.eurDistrict EMPTY');
                }

            } else {
                console.log('Warning: currVote not set. ');
            }
            console.log('segment_keys:');
            console.log(segment_keys);


            const survey = this.$store.state.survey.current.survey;

            if (survey) {

                // TODO : q.agreement is "Tout à fait d'accord" must change !!
                // TODO : q.importance not set if not defined and same prob as before I suppose ...

                const answers = this.$store.state.questions.list.data.questions
                    .map(q => {
                        return {
                            question_key: q.key,
                            answer_format: 'agr_5_scale_tol_3_scale_abs',
                            value: q.agreement,
                            tolerance: q.importance
                        }
                    }).filter(q => q.value != null);

                if (typeof segment_keys !== 'undefined') {
                    console.log('segment_keys');
                    segment_keys.forEach(s =>
                        this.$store.dispatch('performMatch', {
                            segment_key: s,
                            answer_formats: survey.answer_formats,
                            answers: answers
                        }));
                } else {
                    console.log('poll.segment_keys UNDEFINED');
                }


                /*if (typeof poll.segment_keys !== 'undefined') {
                    console.log('poll.segment_keys');
                    poll.segment_keys.forEach(s =>
                    this.$store.dispatch('performMatch', {
                      segment_key: s,
                      answer_formats: survey.answer_formats,
                      answers: answers
                    }));
                } else {
                    console.log('poll.segment_keys UNDEFINED');
                }*/
            } else {
                console.log('Results : survey UNDEFINED');
            }
        },
        mounted() {
            // Redirect to homepage if no survey defined !
            /*if (!this.$store.state.survey.current.poll) {
              this.$router.push('/');
            }*/
        },
        computed: {
            ...mapGetters(['currentElection', 'currentCandidateScores', 'currentSubstituteScores', 'currentElectoralListScores',
                'currentEurCandidateScores', 'currentEurSubstituteScores', 'currentEurElectoralListScores',
                'currentRegCandidateScores', 'currentRegSubstituteScores', 'currentRegElectoralListScores',
                'currentFedCandidateScores', 'currentFedSubstituteScores', 'currentFedElectoralListScores',
                'eurDistrictLists', 'eurCandidates', 'eurSubstitutes',
                'fedDistrictLists', 'fedCandidates', 'fedSubstitutes',
                'regDistrictLists', 'regCandidates', 'regSubstitutes' , 'allPartyImages'])
        },
        data() {
            return {
                showNewsletter: false,
                activeTabs: []
            };
        }
    }
</script>

<style>

    @media print {
        . {
            display: none;
        }
    }

    .tab-center {
        margin: auto;
    }

    .list-legend {
        font-weight: bold;
        font-style: italic;
        font-size: 120%;
        padding: 1em;
    }

    .list-item {
        padding: .6em 0;
        text-align: left;
    }

    .list-item img {
        border-radius: 100%;
    }

    .list-item .title {
        margin-top: .4em;
        font-size: 150%;
        font-weight: bold;
    }

    .list-item .subtitle {
        background: transparent;
        font-size: 120%;
    }

    .list-item .progress {
        margin-top: .6em;
        border-radius: 10px;
    }

    .list-item .progress-bar {
        background-color: #F8E71C;
        color: black;
    }

    .list-scroll {
        height: 70vh;
        overflow-y: scroll;
    }

    .image {
        position: relative;
        overflow: hidden;
        padding-bottom: 100%;
    }

    .image img {
        position: absolute;
    }

    .el-collapse-item__header {
        font-size: 1.2em !important;
        font-weight: bold !important;
        padding: 1em !important;
    }
</style>
